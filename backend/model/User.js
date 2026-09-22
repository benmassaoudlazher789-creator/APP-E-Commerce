const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    //role de l'utilisateur : "client" par defaut, "admin" pour acceder au dashboard
    //(remplace l'ancien champ isAdmin, jamais utilise pour du controle d'acces reel)
    role: {
        type: String,
        enum: ["client", "admin"],
        default: "client",
    },
    addresses: [addressSchema],
    //produits favoris de l'utilisateur (wishlist)
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    //reset de mot de passe : seul le hash du token est stocke, jamais le token en clair
    //(envoye/logue une seule fois, voir auth.controller.js#forgotPassword)
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
}, { timestamps: true });

//hash automatique du mot de passe avant sauvegarde, uniquement s'il a change
//(evite de re-hasher un hash deja existant a chaque save())
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('User', userSchema);
module.exports = User;