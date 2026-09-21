// Script ponctuel : deplace 2 produits "women" classes par erreur dans "men"
// (Nine West Snake-Embossed Ankle-Tie Pump, Clarks Cognac Leather Zip Ankle Boot)
// en corrigeant leur champ gender et leurs pointures (36-41, pointures femme).
//
// Le seed (seedRealProducts.js) est idempotent et n'ecrase jamais un produit
// deja en base : il faut donc ce script pour corriger les documents existants.
// Le nouveau produit men (Cole Haan Lenox Hill Double Monk Strap) est, lui,
// ajoute par : npm run seed:products
//
// Ne touche a aucun autre champ ni aucun autre produit.
//
// Usage : node scripts/fixMisgenderedProducts.js

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/connectDB");
const Product = require("../model/Product");

const fixes = [
    {
        title: "Nine West Snake-Embossed Ankle-Tie Pump",
        sizes: [
            { size: 36, stock: 5 },
            { size: 37, stock: 6 },
            { size: 38, stock: 5 },
            { size: 39, stock: 4 },
            { size: 40, stock: 0 },
        ],
    },
    {
        title: "Clarks Cognac Leather Zip Ankle Boot",
        sizes: [
            { size: 36, stock: 4 },
            { size: 37, stock: 5 },
            { size: 38, stock: 5 },
            { size: 39, stock: 3 },
            { size: 40, stock: 0 },
            { size: 41, stock: 2 },
        ],
    },
];

const fixProducts = async () => {
    await connectDB();

    let updated = 0;
    let notFound = 0;

    for (const { title, sizes } of fixes) {
        const product = await Product.findOneAndUpdate(
            { title },
            { $set: { gender: "women", sizes } },
            { returnDocument: "after" }
        );

        if (!product) {
            notFound += 1;
            console.log(`- introuvable, ignore : ${title}`);
            continue;
        }

        updated += 1;
        console.log(`+ ${title} : gender=${product.gender}, pointures ${product.sizes.map((s) => s.size).join(", ")}`);
    }

    console.log(`\nTermine : ${updated} produit(s) mis a jour, ${notFound} introuvable(s).`);
    await mongoose.disconnect();
    process.exit(0);
};

fixProducts().catch((error) => {
    console.error("Le script a echoue :", error);
    process.exit(1);
});
