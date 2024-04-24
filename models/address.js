const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({

    customer: {
        type: String,
        
        
    },
   
    darea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery', // Name of the referenced model
        required: true,
    },

    fname: {
        type: String,
        required: true,
    },

    lname: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
        
    },

    selectedOption:{
        type: String,
        default: 'home',

    }

   
   
   
}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema);