const mongoose = require('mongoose');

const optionalSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
    },

    price: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        default: 'Active'

    },
   
}, { timestamps: true });

module.exports = mongoose.model("Optional", optionalSchema);