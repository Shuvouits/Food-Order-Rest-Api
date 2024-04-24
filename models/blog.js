const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: true,
    },

    slug: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        default: 'Active'

    },

    category: {
        type: String,
    },

    description: {
        type: String,
        
    },

    editorData: {
        type: String,
        required: true
    }
   
   
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);