import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId, // The type of the product field (e.g., String, ObjectId, etc.)
          ref:"Product"
        },
        quantity: {
          type: Number,
          required: true,
          default: 0
        },
      }
    ]
  });

const Cart = mongoose.model('Cart',cartSchema)

export default Cart