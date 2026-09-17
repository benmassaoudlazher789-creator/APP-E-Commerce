//require
const express = require("express");
const rateLimit = require("express-rate-limit");
const {
    register,
    login,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    forgotPassword,
    resetPassword,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} = require("../controller/auth.controller");
const { registerValidation, validation, loginValidation } = require("../middlewares/validator");
//instance du routeur d'express
const router = express.Router();
const isAuth = require("../middlewares/isAuth");

const upload = require("../util/multer");

// 🔒 Rate limiter pour la route de login uniquement (protection contre les attaques par force brute) :
// ne doit pas s'appliquer a tout /api/auth, sinon des routes comme /current (appelee a chaque
// montage de l'app) epuisent le quota et bloquent aussi register/login sans rapport avec un brute force
//
// `message` DOIT etre un objet (pas une string) : express-rate-limit fait res.send(message), et
// Express ne serialise en JSON que si le body est un objet. Une string part en text/html, que le
// frontend (extractAuthError, qui ne lit que {errors} / {message}) ne sait pas interpreter et qui
// retombe alors sur le message generique "Something went wrong" sans aucune piste sur la vraie cause.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limite à 5 tentatives par IP sur 15 minutes
    message: { message: "Too many login attempts from this IP. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

//routes
router.get("/test", (req, res) => {
    res.status(200).json({ message: "Test route is working!" });
});


//Register route === signup
router.post("/register", upload.single("imageProfile"), registerValidation(), validation, register);
//Login route === signin
router.post("/login", loginLimiter, loginValidation(), validation, login);

//current == user
router.get("/current", isAuth, (req, res) => {
    //personne connectée : reponse enveloppee dans "user" comme register/login,
    //pour que authReducer (qui lit payload.user) fonctionne apres un refresh
    res.json({
        user: {
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            imageProfile: req.user.imageProfile,
            role: req.user.role,
            addresses: req.user.addresses,
        },
    });
});

//mise a jour du profil (nom, email, telephone, mot de passe)
router.patch("/profile", isAuth, updateProfile);

//adresses de livraison enregistrees dans le profil
router.post("/addresses", isAuth, addAddress);
router.patch("/addresses/:addressId", isAuth, updateAddress);
router.delete("/addresses/:addressId", isAuth, deleteAddress);

//reset de mot de passe
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

//favoris (wishlist)
router.get("/wishlist", isAuth, getWishlist);
router.post("/wishlist/:productId", isAuth, addToWishlist);
router.delete("/wishlist/:productId", isAuth, removeFromWishlist);

module.exports = router;