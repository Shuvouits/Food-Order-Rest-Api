const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
   
    slot: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        default: 'Active'
    },

   
}, { timestamps: true });

module.exports = mongoose.model("Time", timeSchema);