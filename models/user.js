const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   
    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
        default: 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/corporate-user-icon.png',

    },

    fullName: {
        type: String,

    },
   
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);