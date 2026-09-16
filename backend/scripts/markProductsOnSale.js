// Script ponctuel : marque une selection de produits deja seedes comme etant
// en promotion, pour peupler la page "Sale".
//
// Ne touche jamais a "price" (le prix de vente actuel reste inchange) : on se
// contente d'ajouter un originalPrice superieur (prix barre) et un
// discountPercentage coherent, puis isOnSale: true. Idempotent : relancer ce
// script met simplement a jour les memes produits avec les memes valeurs.
//
// Cible par "title" (contrairement a seedRealProducts.js qui cible par
// imageProd) car c'est ici le moyen le plus lisible de designer des produits
// deja en base.
//
// Usage : npm run seed:sale   (depuis backend/)
//     ou : node scripts/markProductsOnSale.js

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/connectDB");
const Product = require("../model/Product");

// originalPrice choisi "rond" au-dessus du price actuel ; discountPercentage
// recalcule a partir de l'ecart reel entre originalPrice et price (15-40%).
const salesByTitle = [
    { title: "Clarks Tilden Cap", originalPrice: 189 },
    { title: "Timberland Amherst Leather Boat Shoe", originalPrice: 99 },
    { title: "Superga 2750 Cotu Classic", originalPrice: 89 },
    { title: "Dr. Martens 2976 Chelsea Boot", originalPrice: 249 },
    { title: "Birkenstock Arizona", originalPrice: 149 },
    { title: "Adidas Ultraboost Light", originalPrice: 259 },
    { title: "Puma RS-X Efekt", originalPrice: 179 },
    { title: "Frye Jackson Chelsea Boot", originalPrice: 349 },
];

const markOnSale = async () => {
    await connectDB();

    let updated = 0;
    let notFound = 0;

    for (const { title, originalPrice } of salesByTitle) {
        const product = await Product.findOne({ title });
        if (!product) {
            notFound += 1;
            console.log(`- introuvable, ignore : ${title}`);
            continue;
        }

        const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

        await Product.updateOne(
            { _id: product._id },
            { $set: { originalPrice, discountPercentage, isOnSale: true } }
        );

        updated += 1;
        console.log(`+ ${title} : ${product.price}€ (barre ${originalPrice}€, -${discountPercentage}%)`);
    }

    console.log(`\nTermine : ${updated} produit(s) mis en promo, ${notFound} introuvable(s).`);
    await mongoose.disconnect();
    process.exit(0);
};

markOnSale().catch((error) => {
    console.error("Le script a echoue :", error);
    process.exit(1);
});
