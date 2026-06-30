const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    imageProfile: {
        type: String,
        default: "../images/image.jpg",
    },
     cloudinary_id: String,  
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;