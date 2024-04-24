const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
    },

    slug: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
       

    },

    status: {
        type: String,
        default: 'Active'

    },
   
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);