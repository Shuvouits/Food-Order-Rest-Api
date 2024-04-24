const mongoose = require('mongoose');

const blogCategorySchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
    },

    slug: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        default: 'Active'

    },
   
}, { timestamps: true });

module.exports = mongoose.model("BlogCategory", blogCategorySchema);