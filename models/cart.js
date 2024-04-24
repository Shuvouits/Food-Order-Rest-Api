const mongoose = require('mongoose');


const optionSchema = new mongoose.Schema({
    id: {
        type: String,
    },
  
  
}, { _id: false });


const allOptionalDataSchema = new mongoose.Schema({

    id: {
        type: String
    }, 
    
    name: {
        type: String,
    },

    price: {
        type: Number
    }
  
  
}, { _id: false });


const allProductSizeSchema = new mongoose.Schema({
    id: {
        type: String,
    },

    size: {
        type: String,
    },

    price: {
        type: Number,
    },
  
  
}, { _id: false });



const sizeSchema = new mongoose.Schema({
    id: {
        type: String,
    },
  
}, { _id: false });

const optionInfoSchema = new mongoose.Schema({

    id: {
        type: String,
    }, 
    
    name: {
        type: String,
    },

    price: {
        type: Number,
    },

    status: {
        type: String,
    },
  
}, { _id: false });


const cartSchema = new mongoose.Schema({

    productId:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },

    productName: {
        type: String,
    },

    avatar: {
        type: String,
    },

    productSizeName: {
        type: String,
    },

    productSizePrice: {
        type: Number,
    },

    productSizeId: {
        type: String,
    },

    optionName: {
        type: String
    },

    optionPrice: {
        type: Number
    },

    productQty: {
        type: Number,
        default: 1
    },

    subTotal: {
        type: Number
    },

    customerName: {
        type: String
    },

    productSize: {
        type: [sizeSchema],
        required: true
    },
    optData: {
        type: [optionSchema], // Change the type to an array of strings
        default: undefined,
    },

    optInfo: {
        type: [optionInfoSchema], // Change the type to an array of strings
        default: undefined,
    },

    allProductSize: {
        type: [allProductSizeSchema], // Change the type to an array of strings
        default: undefined,
    },

    allOptionalData: {
        type: [allOptionalDataSchema], // Change the type to an array of strings
        default: undefined,
    },
   
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
