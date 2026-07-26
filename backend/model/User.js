const mongoose = require('mongoose');

// adresse de livraison enregistree dans le profil de l'utilisateur
const addressSchema = new mongoose.Schema({
    label: {
        type: String,
        default: "Home",
        trim: true,
    },
    fullName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
});

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
    phone: {
        type: String,
        default: "",
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
    addresses: [addressSchema],
    //produits favoris de l'utilisateur (wishlist)
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    //reset de mot de passe : seul le hash du token est stocke, jamais le token en clair
    //(envoye/logue une seule fois, voir auth.controller.js#forgotPassword)
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;