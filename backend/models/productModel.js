import mongoose from "mongoose";

// Define the product schema
const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    unlist: {
        type: Boolean,
        default: false
    }
});

// Create the Product model
const Product = mongoose.model('Product', productsSchema);

export default Product;
