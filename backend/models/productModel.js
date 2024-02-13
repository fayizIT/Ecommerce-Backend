import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    category: {
        type:String,
        require:true
      },
    image:{
        type: String,
         required: true
    },
    price:{
        type:Number,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    unlist : {
        type:Boolean,
        default:false
    }

})

const Product = mongoose.model('Product',productsSchema)

export default Product