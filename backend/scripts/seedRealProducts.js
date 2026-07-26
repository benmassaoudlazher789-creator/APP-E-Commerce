// Script de seed permanent : insere le catalogue reel de Red Store a partir
// d'images deja uploadees sur Cloudinary. Idempotent (base sur l'URL Cloudinary
// exacte de imageProd) : relancer ce script ne cree jamais de doublons et ne
// touche pas aux produits deja modifies manuellement depuis leur creation.
//
// Usage : npm run seed:products   (depuis backend/)
//     ou : node scripts/seedRealProducts.js

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/connectDB");
const Product = require("../model/Product");

const products = [
    {
        title: "Nike Court Borough Low Recraft (Toddler)",
        description: "Everyday low-top sneaker for toddlers, with a durable rubber sole and easy slip-on fit.",
        price: 38,
        brand: "Nike",
        category: "shoes",
        gender: "kids",
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1783451934/COURT_BOROUGH_LOW_RECRAFT_TD_qnnos2.avif",
        sizes: [
            { size: 19, stock: 8 },
            { size: 20, stock: 6 },
            { size: 21, stock: 6 },
            { size: 22, stock: 4 },
            { size: 23, stock: 0 },
        ],
    },
    {
        title: "Nike Giannis Freak 7",
        description: "Giannis Antetokounmpo's signature basketball shoe, built for explosive speed and low-to-the-ground stability.",
        price: 130,
        brand: "Nike",
        category: "shoes",
        gender: "men",
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1783451944/GIANNIS_FREAK_7_aw7iuy.avif",
        sizes: [
            { size: 41, stock: 5 },
            { size: 42, stock: 6 },
            { size: 43, stock: 4 },
            { size: 44, stock: 3 },
            { size: 45, stock: 0 },
            { size: 46, stock: 2 },
        ],
    },
    {
        title: "Nike Pegasus Premium",
        description: "Premium daily trainer with a full-length carbon-fiber plate for a responsive, energized ride.",
        price: 160,
        brand: "Nike",
        category: "shoes",
        gender: "men",
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1783451954/NIKE_PEGASUS_PREMIUM_p18nob.avif",
        sizes: [
            { size: 40, stock: 4 },
            { size: 41, stock: 5 },
            { size: 42, stock: 5 },
            { size: 43, stock: 3 },
            { size: 44, stock: 0 },
        ],
    },
    {
        title: "Nike Air Force 1 '07 (Women's)",
        description: "The classic since 1982. Crisp leather upper, Air-Sole cushioning, timeless court style.",
        price: 115,
        brand: "Nike",
        category: "shoes",
        gender: "women",
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1783451970/W_AIR_FORCE_1_07_v0l5sa.avif",
        sizes: [
            { size: 36, stock: 6 },
            { size: 37, stock: 5 },
            { size: 38, stock: 0 },
            { size: 39, stock: 4 },
            { size: 40, stock: 3 },
        ],
    },
    {
        title: "Jordan Luka 77 (GS)",
        description: "Luka Doncic's signature shoe in grade-school sizing, tuned for quick cuts and step-back jumpers.",
        price: 85,
        brand: "Jordan",
        category: "shoes",
        gender: "kids",
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1783451994/JORDAN_LUKA_77_GS_gruehm.avif",
        sizes: [
            { size: 35, stock: 5 },
            { size: 36, stock: 5 },
            { size: 37, stock: 0 },
            { size: 38, stock: 4 },
            { size: 39, stock: 3 },
        ],
    },
    {
        title: "Nike Court Vision Low (Women's)",
        description: "Retro basketball style with a modern, everyday-friendly build. Perforated leather upper, cushioned midsole.",
        price: 75,
        brand: "Nike",
        category: "shoes",
        gender: "women",
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1783452009/W_NIKE_COURT_VISION_LO_P_NBK_xp0odn.avif",
        sizes: [
            { size: 36, stock: 7 },
            { size: 37, stock: 6 },
            { size: 38, stock: 4 },
            { size: 39, stock: 0 },
            { size: 40, stock: 2 },
        ],
    },
    {
        title: "Air Jordan 1 Low",
        description: "The low-top take on the shoe that started it all. Iconic colorblocking, everyday comfort.",
        price: 110,
        brand: "Jordan",
        category: "shoes",
        gender: "men",
        imageProd: "https://res.cloudinary.com/dvvekltxc/image/upload/v1783452026/AIR_JORDAN_1_LOW_1_kymf9u.avif",
        sizes: [
            { size: 40, stock: 5 },
            { size: 41, stock: 6 },
            { size: 42, stock: 6 },
            { size: 43, stock: 4 },
            { size: 44, stock: 0 },
            { size: 45, stock: 2 },
        ],
    },
];

const seed = async () => {
    await connectDB();

    let created = 0;
    let skipped = 0;

    for (const product of products) {
        try {
            // Mongoose 9 a renomme l'ancienne option "rawResult" en
            // "includeResultMetadata" pour findOneAndUpdate (l'ancien nom est
            // silencieusement ignore et fait planter la detection insert/skip).
            const result = await Product.findOneAndUpdate(
                { imageProd: product.imageProd },
                { $setOnInsert: product },
                { upsert: true, includeResultMetadata: true }
            );

            if (result.lastErrorObject?.updatedExisting) {
                skipped += 1;
                console.log(`- déjà présent, ignoré : ${product.title}`);
            } else {
                created += 1;
                console.log(`+ créé : ${product.title}`);
            }
        } catch (error) {
            console.error(`✗ échec pour "${product.title}" :`, error.message);
        }
    }

    console.log(`\nTerminé : ${created} créé(s), ${skipped} déjà présent(s).`);
    await mongoose.disconnect();
    process.exit(0);
};

seed().catch((error) => {
    console.error("Le seed a échoué :", error);
    process.exit(1);
});
