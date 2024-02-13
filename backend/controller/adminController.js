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


const addProduct = asyncHandler(async (req, res) => {
    const { name, category, description, price } = req.body;
    
    
    const productImage = req.file ? req.file.filename : null;

    if (!productImage) {
        return res.status(400).json({ error: 'Image is required.' });
    }
    
    const newProduct = new Product({
        name,
        category,
        image: productImage,
        price,
        description,
    });
    try {
      const savedProduct = await newProduct.save();
        // Save the new product to the database
        res.status(201).json(savedProduct);
      } catch (error) {
          if (error.name === 'ValidationError') {
              // Handle validation errors
              return res.status(400).json({ error: error.message });
          }
      
          // Handle other types of errors
          console.error('Error in addProduct:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
});


const unlistProduct = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
  
    try {
      // Find the product by ID and update the unlist field to true
      const product = await Product.findByIdAndUpdate(
        productId,
        { $set: { unlist: true } },
        { new: true }
      );
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product unlisted successfully', product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


const listProduct = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
  
    try {
      // Find the product by ID and update the unlist field to true
      const product = await Product.findByIdAndUpdate(
        productId,
        { $set: { unlist: false } },
        { new: true }
      );
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product listed successfully', product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

export { loginAdmin, registerAdmin, logoutAdmin, addProduct, unlistProduct, listProduct };
