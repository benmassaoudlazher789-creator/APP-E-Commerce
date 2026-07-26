const User = require("../model/User");
const Product = require("../model/Product");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const cloudinary = require("../util/cloudinary");

// forme commune renvoyee au frontend pour un user (jamais le mot de passe)
const sanitizeUser = (user) => ({
    name: user.name,
    email: user.email,
    phone: user.phone,
    imageProfile: user.imageProfile,
    cloudinary_id: user.cloudinary_id,
    isAdmin: user.isAdmin,
    addresses: user.addresses,
});

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

//mise a jour des informations du profil (nom, email, telephone, mot de passe optionnel)
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (email) {
            const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
            if (existing) return res.status(400).json({ message: "Email already in use" });
        }

        if (name) req.user.name = name;
        if (email) req.user.email = email;
        if (phone !== undefined) req.user.phone = phone;
        if (password) {
            if (password.length < 6 || password.length > 32) {
                return res.status(400).json({ message: "Password must be between 6 and 32 characters" });
            }
            req.user.password = await bcrypt.hash(password, 10);
        }

        await req.user.save();
        res.status(200).json({ message: "Profile updated successfully", user: sanitizeUser(req.user) });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//ajoute une nouvelle adresse de livraison au profil
exports.addAddress = async (req, res) => {
    try {
        const { label, fullName, address, city, postalCode, phone, isDefault } = req.body;
        if (!fullName || !address || !city || !postalCode || !phone) {
            return res.status(400).json({ message: "All address fields are required" });
        }
        if (isDefault) req.user.addresses.forEach((a) => { a.isDefault = false; });
        req.user.addresses.push({ label, fullName, address, city, postalCode, phone, isDefault: !!isDefault });
        await req.user.save();
        res.status(201).json({ message: "Address added successfully", user: sanitizeUser(req.user) });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//modifie une adresse existante
exports.updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const addressDoc = req.user.addresses.id(addressId);
        if (!addressDoc) return res.status(404).json({ message: "Address not found" });

        const { label, fullName, address, city, postalCode, phone, isDefault } = req.body;
        if (label !== undefined) addressDoc.label = label;
        if (fullName !== undefined) addressDoc.fullName = fullName;
        if (address !== undefined) addressDoc.address = address;
        if (city !== undefined) addressDoc.city = city;
        if (postalCode !== undefined) addressDoc.postalCode = postalCode;
        if (phone !== undefined) addressDoc.phone = phone;
        if (isDefault) {
            req.user.addresses.forEach((a) => { a.isDefault = false; });
            addressDoc.isDefault = true;
        }

        await req.user.save();
        res.status(200).json({ message: "Address updated successfully", user: sanitizeUser(req.user) });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//supprime une adresse du profil
exports.deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const addressDoc = req.user.addresses.id(addressId);
        if (!addressDoc) return res.status(404).json({ message: "Address not found" });

        addressDoc.deleteOne();
        await req.user.save();
        res.status(200).json({ message: "Address deleted successfully", user: sanitizeUser(req.user) });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//demande de reset de mot de passe : genere un token temporaire (1h), envoie un email si un
//service mail est configure (aucun ne l'est actuellement, voir CLAUDE.md), sinon logue le lien
//en console pour le flux de dev. Repond toujours le meme message, que l'email existe ou non,
//pour ne pas laisser un attaquant deviner quels emails sont enregistres
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const genericMsg = { message: "If this email is registered, a reset link has been sent." };
        if (!email) return res.status(400).json({ message: "Email is required" });

        const foundUser = await User.findOne({ email });
        if (!foundUser) return res.status(200).json(genericMsg);

        const rawToken = crypto.randomBytes(32).toString("hex");
        foundUser.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        foundUser.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1h
        await foundUser.save();

        const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${rawToken}`;

        if (process.env.SMTP_HOST) {
            // aucun service mail configure dans ce projet (voir CLAUDE.md, backend/.env) :
            // ce bloc est laisse en place pour brancher un vrai envoi plus tard sans retoucher
            // le reste du flux.
        } else {
            console.log(`[dev] Password reset link for ${email}: ${resetLink}`);
        }

        res.status(200).json(genericMsg);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//applique le nouveau mot de passe si le token (recu par lien) est valide et non expire
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password || password.length < 6 || password.length > 32) {
            return res.status(400).json({ message: "Password must be between 6 and 32 characters" });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const foundUser = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        }).select("+resetPasswordToken +resetPasswordExpires");

        if (!foundUser) return res.status(400).json({ message: "Invalid or expired reset link" });

        foundUser.password = await bcrypt.hash(password, 10);
        foundUser.resetPasswordToken = undefined;
        foundUser.resetPasswordExpires = undefined;
        await foundUser.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//liste des produits favoris de l'utilisateur connecte
exports.getWishlist = async (req, res) => {
    try {
        const populated = await req.user.populate("wishlist");
        res.status(200).json({ message: "Wishlist:", wishlist: populated.wishlist });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//ajoute un produit aux favoris (idempotent)
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (!req.user.wishlist.some((id) => id.toString() === productId)) {
            req.user.wishlist.push(productId);
            await req.user.save();
        }
        res.status(200).json({ message: "Added to wishlist", wishlist: req.user.wishlist });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

//retire un produit des favoris
exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        req.user.wishlist = req.user.wishlist.filter((id) => id.toString() !== productId);
        await req.user.save();
        res.status(200).json({ message: "Removed from wishlist", wishlist: req.user.wishlist });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};