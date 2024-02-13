import asyncHandler from 'express-async-handler';
import Admin from '../models/adminModel.js';
import Product from "../models/productModel.js";
import generateTokenAdmin from "../utils/generateTokenAdmin.js";

const generateAdminResponse = (res, admin) => {
    generateTokenAdmin(res, admin._id);
    res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
    });
};

// Admin  for login
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

// Register  for Admin
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

// Logout for Admin
const logoutAdmin = asyncHandler(async (req, res) => {
    res.cookie('adminJwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out' });
});

//add product by Admin side
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

//unlist the current products by Admin side
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

//list the current products by Admin side
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

// update the products details by Admin side
const updateProduct = asyncHandler(async (req, res) => {
    
    const { productId, name, category, description, price } = req.body;

    console.log(name, category, description, price, productId);
  
    // Check if productId is provided
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
  
    try {
      // Find the existing product by ID
      const existingProduct = await Product.findById(productId);

      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Update fields only if they are provided in the request
      if (name) existingProduct.name = name;
      if (category) existingProduct.category = category;
      if (description) existingProduct.description = description;
      if (price) existingProduct.price = price;
  
      // Check if a new file is provided
      if (req.file) {
        // If a new file is provided, update the image
        existingProduct.image = req.file.filename;
      }

      console.log(existingProduct, 'updated product');
  
      // Save the updated product to the database
      const updatedProduct = await existingProduct.save();
  
      // Respond with the updated product details
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error while updating product' });
    }
});


const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({});
        
        if (products && products.length > 0) {
            res.status(200).json(products);
        } else {
            // Change status code to 204 (No Content) when there are no products
            res.status(204).json({ message: 'No products found' });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




export { loginAdmin, registerAdmin, logoutAdmin, addProduct, unlistProduct, listProduct, updateProduct, getAllProducts };
