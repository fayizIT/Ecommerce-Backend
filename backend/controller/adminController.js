import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import Product from "../models/productModel.js";
import generateTokenAdmin from "../utils/generateTokenAdmin.js";
import User from "../models/userModel.js";

// Command Line for Admin Login: curl -X POST -H "Content-Type: application/json" -d '{"email": "admin@example.com", "password": "yourpassword"}' http://your-api-endpoint/authAdmin

// Admin login
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPaswword(password))) {
    generateTokenAdmin(res, admin._id);
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Command Line for Admin Registration: curl -X POST -H "Content-Type: application/json" -d '{"name": "Admin Name", "email": "admin@example.com", "password": "yourpassword", "key": "youradminkey"}' http://your-api-endpoint/registerAdmin

// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, key } = req.body;

  const adminExist = await Admin.findOne({ email });

  if (adminExist) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  if (key !== process.env.ADMIN_KEY) {
    res.status(401);
    throw new Error("Invalid Key");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
  });

  if (admin) {
    generateTokenAdmin(res, admin._id);
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

// POST http://your-api-endpoint/logoutAdmin

// Log out admin
const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("adminJwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out" });
});

// POST -H "Content-Type: application/json" -d '{"name": "Product Name", "category": "Category", "description": "Product Description", "price": 20}' -F "image=@/path/to/your/image.jpg" http://your-api-endpoint/addProduct

// Adding product
const addProduct = asyncHandler(async (req, res) => {
  const { name, category, description, price } = req.body;

  const productImage = req.file ? req.file.filename : null;

  if (!productImage) {
    return res.status(400).json({ error: "Image is required." });
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
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error in addProduct:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT http://your-api-endpoint/unlistProduct/:productId

// Unlist Products
const unlistProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: { unlist: true } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product unlisted successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT http://your-api-endpoint/listProduct/:productId

// Listing Products
const listProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: { unlist: false } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product listed successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Editing product
const editProduct = asyncHandler(async (req, res) => {
  const { productId, name, category, description, price } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (name) existingProduct.name = name;
    if (category) existingProduct.category = category;
    if (description) existingProduct.description = description;
    if (price) existingProduct.price = price;

    if (req.file) {
      existingProduct.image = req.file.filename;
    }

    const updatedProduct = await existingProduct.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get all products
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});

    if (products && products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ error: "No products found" });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});

    if (users && users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: "No users found" });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//delete the user
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Use deleteOne method to delete the user
    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});









export {
  authAdmin,
  registerAdmin,
  logoutAdmin,
  addProduct,
  unlistProduct,
  listProduct,
  editProduct,
  getAllProduct,
  getAllUsers,
  deleteUser
};
