const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
    },

    minTime: {
        type: String,
        required: true,
        
    },

    maxTime: {
        type: String,
        required: true,
    },

    dfee: {
        type: String,
        required: true,
    },
 
    status: {
        type: String,
        default: 'Active'

    },
   
}, { timestamps: true });

module.exports = mongoose.model("Delivery", deliverySchema);