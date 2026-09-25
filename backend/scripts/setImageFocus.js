// Script ponctuel : definit le point focal (imageFocus) des produits dont la photo
// principale est une mise en scene, pour que les miniatures recadrees (panier)
// montrent la chaussure plutot que le decor. Idempotent.
//
// x / y = position du produit dans imageProd, en % (0 = gauche/haut) ; zoom >= 1.
// Valeurs mesurees sur la photo : pour l'Adidas Predator, la chaussure est a droite
// du ballon (centre ~63% / 51%) et occupe ~45% de la largeur.
//
// Usage : node scripts/setImageFocus.js   (depuis backend/)

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/connectDB");
const Product = require("../model/Product");

const focusByTitle = [
    { title: "Adidas Predator Accuracy", imageFocus: { x: 63, y: 51, zoom: 1.7 } },
];

const setImageFocus = async () => {
    await connectDB();

    for (const { title, imageFocus } of focusByTitle) {
        const result = await Product.updateOne({ title }, { $set: { imageFocus } });
        console.log(result.matchedCount ? `+ ${title} : ${JSON.stringify(imageFocus)}` : `- introuvable, ignore : ${title}`);
    }

    await mongoose.disconnect();
};

setImageFocus().catch((error) => {
    console.error(error);
    process.exit(1);
});
