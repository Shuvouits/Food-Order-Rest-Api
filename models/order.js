const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    productName: {
        type: String,
    },
    avatar: {
        type: String,
    },

    customerName: {
        type: String,

    }, 

    productQty: {
        type: Number
    },

    subTotal: {
        type: Number
    },

    productSizePrice: {
        type: Number
    },

    productSizeName: {
        type: String
    } 

}, { _id: false });






const orderSchema = new mongoose.Schema({


    customerId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    cartData: {
        type: [cartSchema],
        required : true
    },

    grandTotal: {
        type: Number
    },

    address: {
        type: String
    },

    deliveryFee: {
        type: Number
    }, 

   

    orderStatus : {
        type: String,
        default : "Pending" // Correction made here
    }, 


    
   
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
