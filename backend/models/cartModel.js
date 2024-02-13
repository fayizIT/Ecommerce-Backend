import mongoose from 'mongoose';

// Define the cart schema
const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Reference to the User model
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true,
                default: 0
            },
        }
    ]
});

// Create the Cart model
const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
