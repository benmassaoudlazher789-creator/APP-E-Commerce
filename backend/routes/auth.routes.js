//require
const express = require("express");
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



//routes
router.get("/test", (req, res) => {
    res.status(200).json({ message: "Test route is working!" });
});


//Register route === signup
router.post("/register", upload.single("imageProfile"), registerValidation(), validation, register);
//Login route === signin
router.post("/login", loginValidation(), validation, login);

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
            isAdmin: req.user.isAdmin,
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