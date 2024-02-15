import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import Product from "../models/productModel.js";
import generateTokenAdmin from "../utils/generateTokenAdmin.js";


//Admin login
const authAdmin = asyncHandler( async(req,res)=>{
    const {email,password}= req.body;

    const admin = await Admin.findOne({email});

    if(admin && (await admin.matchPaswword(password))){
        generateTokenAdmin(res,admin._id)
        res.status(201).json({
            _id:admin._id,
            name:admin.name,
            email:admin.email
        })
    }else{
        res.status(400);
        throw new Error('invalid email or password')
    }


});


//Register Admin

const registerAdmin = asyncHandler( async(req,res)=>{
    const {name,email,password,key} = req.body

    const adminExist = await Admin.findOne({email});

    if(adminExist){
        res.status(400);
        throw new Error('Admin already exisit')
    }
    console.log(key,'keyyyyyyyyyy')
    if(key!== process.env.ADMIN_KEY){
        res.status(401);
        throw new Error('Invalid Key')
    }

    const admin = await Admin.create({
        name,
        email,
        password
    })

    

    if(admin){
        generateTokenAdmin(res,admin._id)
        res.status(201).json({
            _id:admin._id,
            name:admin.name,
            email:admin.email
        })
    }else{
        res.status(400);
        throw new Error('invalid admin data')
    }
    
});


// Loggin out admin

const logoutAdmin = asyncHandler( async(req,res)=>{
    res.cookie('adminJwt','',{
        httpOnly:true,
        expires:new Date(0)
    })
    res.status(200).json({message:"Logged out"})
});


// Adding product

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

// Unlist Products

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


// Listing Products
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

// Editing product
const editProduct = asyncHandler(async (req, res) => {
    
    const {productId, name, category, description, price } = req.body;

    console.log(name,category,description,price,productId);
  
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

      console.log(existingProduct,'existing');
  
      // Save the updated product to the database
      const updatedProduct = await existingProduct.save();
  
      // Respond with the updated product details
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  const getAllProduct = asyncHandler(async (req, res) => {
    try {
      const products = await Product.find({});
      
      if (products && products.length > 0) {
        res.status(200).json(products);
      } else {
        res.status(404).json({ error: 'No products found' });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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
    getAllProduct
}



