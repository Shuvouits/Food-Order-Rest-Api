const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
    },

    code: {
        type: String,
        required: true,
    },

    expireDate: {
        type: String,
        required: true,
    },

    discount: {
        type: String,
        required: true,
    },
 
    status: {
        type: String,
        default: 'Active'

    },
   
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);