const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Name of the referenced model
       
        
        
    },
   
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Name of the referenced model
        
    },

   
   
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);