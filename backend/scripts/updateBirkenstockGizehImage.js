// Script ponctuel : met a jour uniquement le champ imageProd du produit
// "Birkenstock Gizeh" deja en base (l'ancienne image montrait des jambes/
// pieds sur une plage, pas un plan produit). Ne touche a aucun autre champ
// ni aucun autre produit.
//
// Usage : node scripts/updateBirkenstockGizehImage.js

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/connectDB");
const Product = require("../model/Product");

const TITLE = "Birkenstock Gizeh";
const NEW_IMAGE = "https://images.unsplash.com/photo-1628626126093-97c2c464ca5d?q=80&w=1200&auto=format&fit=crop";

const updateImage = async () => {
    await connectDB();

    const product = await Product.findOneAndUpdate(
        { title: TITLE },
        { $set: { imageProd: NEW_IMAGE } },
        { new: true }
    );

    if (!product) {
        console.log(`Introuvable : ${TITLE}`);
    } else {
        console.log(`Image mise a jour pour "${TITLE}" : ${product.imageProd}`);
    }

    await mongoose.disconnect();
    process.exit(product ? 0 : 1);
};

updateImage().catch((error) => {
    console.error("Le script a echoue :", error);
    process.exit(1);
});
