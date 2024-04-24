const mongoose = require('mongoose');

const generateRandomId = () => {
   
    return Math.floor(Math.random() * 1000000).toString();
};


const sizeSchema = new mongoose.Schema({
    id: {
        type: String,
        default: generateRandomId,
    },
    size: {
        type: String,
    },
    price: {
        type: String,
    }
}, { _id: false });

const specificationSchema = new mongoose.Schema({
    id: {
        type: String,
        default: generateRandomId,
    },
    sname: {
        type: String,
    }
}, { _id: false });

const multipleSchema = new mongoose.Schema({
    id: {
        type: String,
        default: generateRandomId,
    },
    link: {
        type: String,
    }
}, { _id: false });

const optionalSchema = new mongoose.Schema({

    id: {
        type: String,
    }

}, { _id: false })


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
    },
    slug: {
        type: String,
    },
    category: {
        type: String,
    },
    price: {
        type: String,
    },
    offerPrice: {
        type: String,
    },
    vedioUrl: {
        type: String,
    },

    status: {
        type: String,
        default: 'Active'
    },

    tdescription: {
        type: String,
    },
    bdescription: {
        type: String,
    },
    ldescription: {
        type: String,
    },
    populer: {
        type: String,
        default: 'Yes'
    },
    avatar: {
        type: String,
    },
    vavatar: {
        type: String,
    },
    optionalItem: {
        type: [optionalSchema],
       /* type: mongoose.Schema.Types.ObjectId, */
        default: undefined
    },
    multipleImage: {
        type: [multipleSchema], // Change the type to an array of strings
        default: undefined,
    },
    productSize: {
        type: [sizeSchema],
        default: undefined
    },
    specification: {
        type: [specificationSchema],
        default: undefined
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
