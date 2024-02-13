import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";



// When user Register
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const userExist = await User.findOne({ email: email });
  
      if (userExist) {
        throw new Error('User already exists');
      }
  
      const user = await User.create({ name, email, password });
  
      if (!user) {
        throw new Error('Error creating user');
      }
  
      const userId = user._id;
      // Assuming generateToken is defined somewhere
      generateToken(res, userId);
  
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      res.status(400).json({ error: error.message || 'Invalid data' });
    }
  });
  
 



  //When user login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      const responseData = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
  
      if (user.imagePath) {
        responseData.imagePath = user.imagePath;
      }
  
      res.status(201).json(responseData);
    } else {
      res.status(400);
      throw new Error("invalid email or password");
    }
  });



  const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    };
    res.status(200).json(user);
  });



  const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "User logged out" });
  });




  const getProductList = asyncHandler(async (req, res) => {
    try {
      const listedProducts = await Product.find({ unlist: false });
      if (listedProducts && listedProducts.length > 0) {
        res.status(200).json(listedProducts);
      } else {
        res.status(404).json({ error: "No products found" });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  const addToCart = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;

        const userId = req.user._id;

        // Check if the user has a cart
        let cart = await Cart.findOne({ user_id: userId });

        // If the user doesn't have a cart, create a new one
        if (!cart) {
            cart = new Cart({
                user_id: userId,
                products: [{ productId, quantity: 1 }],
            });

            await cart.save();
            return res.status(201).json(cart);
        }

        // If the user already has a cart, check if the product is already in the cart
        const existingProduct = cart.products.find(
            (product) => product.productId.toString() === productId
        );

        if (existingProduct) {
            // If the product is already in the cart, increase the quantity by one
            existingProduct.quantity += 1;
        } else {
            // If the product is not in the cart, add it with a quantity of one
            cart.products.push({ productId, quantity: 1 });
        }

        await cart.save();
        return res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


const fetchCartDetails = asyncHandler(async (req, res) => {
  try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ user_id: userId })
          .populate({
              path: "products.productId", // Specify the path to the 'productId' field in the 'products' array
              model: "Product", // Specify the model to use for population (assuming 'Product' is the model name)
              select: "name price image", // Specify the fields you want to select from the 'Product' model
          })
          .exec();

      console.log(userId);

      console.log(cart, "cart");

      if (!cart) {
          throw new Error("There are no products in the cart");
      }

      return res.status(200).json(cart);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
});


const retrieveCartDetails = asyncHandler(async (req, res) => {
  try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ user_id: userId })
          .populate({
              path: "products.productId", // Specify the path to the 'productId' field in the 'products' array
              model: "Product", // Specify the model to use for population (assuming 'Product' is the model name)
              select: "name price image", // Specify the fields you want to select from the 'Product' model
          })
          .exec();

      console.log(userId);

      console.log(cart, "cart");

      if (!cart) {
          throw new Error("No products found in the user's cart");
      }

      return res.status(200).json(cart);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error while retrieving cart details" });
  }
});


const updateQuantity = asyncHandler(async (req, res) => {
  try {
      const { count, productId } = req.body;

      const userId = req.user._id;

      const cart = await Cart.findOne({
          user_id: userId,
          "products.productId": productId,
      });

      if (!cart) {
          return res.status(404).json({ error: "Product not found in the cart" });
      }

      // Finding the index of the product in the products array
      const productIndex = cart.products.findIndex(
          (product) => product.productId.toString() === productId
      );

      if (productIndex === -1) {
          return res.status(404).json({ error: "Product not found in the cart" });
      }

      // Updating the quantity based on the count provided
      const newQuantity = cart.products[productIndex].quantity + parseInt(count);

      // Check if the new quantity is greater than or equal to 1 before updating
      if (newQuantity >= 1) {
          cart.products[productIndex].quantity = newQuantity;
      } else {
          // Optionally handle the case where the quantity would go below 1 (e.g., show an error message)
          return res.status(400).json({ error: "Quantity cannot be less than 1" });
      }

      // Saving the updated cart document
      await cart.save();

      return res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error while updating quantity" });
  }
});







  export { 
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    getProductList,
    addToCart,
    fetchCartDetails,
    retrieveCartDetails,
    updateQuantity

  };