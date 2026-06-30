//require
const express = require("express");
const { register, login } = require("../controller/auth.controller");
const { registerValidation, validation, loginValidation } = require("../middlewares/validator");
//instance du routeur d'express
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const cloudinary = require("../util/cloudinary");
const upload = require("../util/multer");
const User = require("../model/User");



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
    //personne connectée
    res.json((userConnected = { name: req.user.name, email: req.user.email, }));
});

router.post("/", upload.single("image"), async (req, res) => {
    try {
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        // Create new user
        let user = new User({
            name: req.body.name,
            profile_img: result.secure_url,
            cloudinary_id: result.public_id,
        });
        // save user details in mongodb
        await user.save();
        res.status(200)
            .send({
                user
            });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;