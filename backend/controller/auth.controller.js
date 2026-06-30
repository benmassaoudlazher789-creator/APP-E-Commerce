const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cloudinary = require("../util/cloudinary");
//register = signup
exports.register = async (req, res) => {
    try {
        //recoit la requete du frontend == submit du formulaire d'inscription
        const { name, email, password } = req.body; //req apartir de frontend
        //recherche de l'utilisateur par son email
        const foundUser = await User.findOne({ email: email });
        //si l'utilisateur existe déjà == email trouvé
        if (foundUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        let imageProfile = "";
        let cloudinary_id = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageProfile = result.secure_url;
            cloudinary_id = result.public_id;
        }
        //email non trouvée
        //creation selon le modéle
        //cryptage du mot de passe avec bcrypt
        const saltRound = 10;
        let hashedPassword = await bcrypt.hash(password, saltRound);
        const newUser = new User({ name, email, password: hashedPassword, imageProfile, cloudinary_id });
        //sauvgarde dans le BD 
        await newUser.save();
        //token = JWT
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '2h' });
        //response
        res.status(201).json({ message: "User registered successfully",  user: { name, email, imageProfile, cloudinary_id }, token });
    } catch (error) {
         console.error("ERREUR REGISTER:", error);
        res.status(500).json({ message: "Server error" }, error);
    }
};
//login = signin

exports.login = async (req, res) => {

    try {
        //req que jai recu du frontend == submit du formulaire de connexion   
        const { email, password } = req.body;
        //recherche par Email
        const foundUser = await User.findOne({ email: email });
        //je ne trouve pas l'utilisateur
        if (!foundUser) {
            return res.status(400).json({ message: "Invalid email or password " });
        }

        //email correct mais le mot de passe est incorrect
        const checkPassword = await bcrypt.compare(password, foundUser.password);
        //si le mot de passe est incorrect
        if (!checkPassword) return res.status(401).json({ message: "Invalid email or password " });



        //token JWT
        const token = jwt.sign({ id: foundUser._id }, process.env.SECRET_KEY, { expiresIn: '2h' });
        //response
        res.status(200).json({ message: "Login successful", user: { name: foundUser.name, email: foundUser.email, imageProfile: foundUser.imageProfile, cloudinary_id: foundUser.cloudinary_id }, token });




    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

};