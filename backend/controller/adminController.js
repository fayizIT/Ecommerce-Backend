import asyncHandler from 'express-async-handler';
import Admin from '../models/adminModel.js';

const generateAdminResponse = (res, admin) => {
    generateTokenAdmin(res, admin._id);
    res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
    });
};

// Admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPaswword(password))) {
        generateAdminResponse(res, admin);
    } else {
        res.status(400);
        throw new Error('Invalid email or password');
    }
});

// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, key } = req.body;

    const adminExist = await Admin.findOne({ email });

    if (adminExist) {
        res.status(400);
        throw new Error('Admin already exists');
    }

    console.log(key, 'key');

    if (key !== process.env.ADMIN_KEY) {
        res.status(401);
        throw new Error('Invalid Key');
    }

    const admin = await Admin.create({
        name,
        email,
        password,
    });

    if (admin) {
        generateAdminResponse(res, admin);
    } else {
        res.status(400);
        throw new Error('Invalid admin data');
    }
});

// Logout Admin
const logoutAdmin = asyncHandler(async (req, res) => {
    res.cookie('adminJwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out' });
});

export { loginAdmin, registerAdmin, logoutAdmin };
