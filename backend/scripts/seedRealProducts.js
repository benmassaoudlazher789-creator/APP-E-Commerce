// Script de seed permanent : insere le catalogue reel de Red Store - Shoes.
// Idempotent (base sur l'URL exacte de imageProd) : relancer ce script ne cree
// jamais de doublons et ne touche pas aux produits deja modifies manuellement
// depuis leur creation.
//
// Ce script supprime d'abord l'ancien catalogue "sneakers" (Nike/Jordan) par
// URL exacte, avant d'inserer le nouveau catalogue multi-categories.
//
// Usage : npm run seed:products   (depuis backend/)
//     ou : node scripts/seedRealProducts.js

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/connectDB");
const Product = require("../model/Product");

// Ancien catalogue "sneakers" (Nike/Jordan) a retirer avant de repeupler.
// Identifie par l'URL Cloudinary exacte de imageProd, pour ne supprimer que
// ces 7 produits precis et ne pas toucher a d'eventuels produits ajoutes
// manuellement depuis.
const legacyImageUrls = [
    "https://res.cloudinary.com/dvvekltxc/image/upload/v1783451934/COURT_BOROUGH_LOW_RECRAFT_TD_qnnos2.avif",
    "https://res.cloudinary.com/dvvekltxc/image/upload/v1783451944/GIANNIS_FREAK_7_aw7iuy.avif",
    "https://res.cloudinary.com/dvvekltxc/image/upload/v1783451954/NIKE_PEGASUS_PREMIUM_p18nob.avif",
    "https://res.cloudinary.com/dvvekltxc/image/upload/v1783451970/W_AIR_FORCE_1_07_v0l5sa.avif",
    "https://res.cloudinary.com/dvvekltxc/image/upload/v1783451994/JORDAN_LUKA_77_GS_gruehm.avif",
    "https://res.cloudinary.com/dvvekltxc/image/upload/v1783452009/W_NIKE_COURT_VISION_LO_P_NBK_xp0odn.avif",
    "https://res.cloudinary.com/dvvekltxc/image/upload/v1783452026/AIR_JORDAN_1_LOW_1_kymf9u.avif",
];

const products = [
    // --- Chaussures formelles / habillees ---
    {
        title: "Clarks Tilden Cap",
        description: "Classic cap-toe derby in polished black leather, built on a cushioned Ortholite footbed for all-day comfort at the office.",
        price: 145,
        brand: "Clarks",
        category: "shoes",
        gender: "men",
        imageProd: "https://images.unsplash.com/photo-1668069226492-508742b03147?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 40, stock: 5 },
            { size: 41, stock: 6 },
            { size: 42, stock: 6 },
            { size: 43, stock: 4 },
            { size: 44, stock: 0 },
            { size: 45, stock: 2 },
        ],
        createdAt: new Date("2025-10-03"),
    },
    {
        title: "Ecco Melbourne Cap-Toe Oxford",
        description: "Hand-finished black leather oxford with a lightweight comfort sole, sharp enough for the boardroom, soft enough for the commute.",
        price: 165,
        brand: "Ecco",
        category: "shoes",
        gender: "men",
        imageProd: "https://images.unsplash.com/photo-1784822041270-7cc959c33cbb?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 40, stock: 4 },
            { size: 41, stock: 5 },
            { size: 42, stock: 5 },
            { size: 43, stock: 3 },
            { size: 44, stock: 2 },
            { size: 45, stock: 0 },
        ],
        createdAt: new Date("2025-10-18"),
    },
    {
        title: "Florsheim Kingston Moc-Toe",
        description: "Rich brown leather moc-toe dress shoe with hand-sewn detailing, a versatile pick for both suits and dark denim.",
        price: 135,
        brand: "Florsheim",
        category: "shoes",
        gender: "men",
        imageProd: "https://images.unsplash.com/photo-1472591651607-70e2d88ae3c4?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 40, stock: 5 },
            { size: 41, stock: 5 },
            { size: 42, stock: 4 },
            { size: 43, stock: 0 },
            { size: 44, stock: 3 },
        ],
        createdAt: new Date("2025-11-02"),
    },
    {
        title: "Cole Haan Harrison Grand Oxford",
        description: "Women's cognac leather oxford with Grand.OS cushioning technology, pairing menswear-inspired style with genuine all-day comfort.",
        price: 155,
        brand: "Cole Haan",
        category: "shoes",
        gender: "women",
        imageProd: "https://images.unsplash.com/photo-1689855217805-c47cd002dbe8?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 36, stock: 4 },
            { size: 37, stock: 5 },
            { size: 38, stock: 5 },
            { size: 39, stock: 0 },
            { size: 40, stock: 3 },
        ],
        createdAt: new Date("2025-11-20"),
    },

    // --- Chaussures casual ---
    {
        title: "Timberland Amherst Leather Boat Shoe",
        description: "Soft nubuck leather upper with a hand-sewn moc-toe and rawhide laces, a non-marking rubber outsole ready for the boat dock or a sunny weekend.",
        price: 75,
        brand: "Timberland",
        category: "shoes",
        gender: "men",
        imageProd: "https://images.unsplash.com/photo-1715764783691-da317960ba09?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 40, stock: 6 },
            { size: 41, stock: 6 },
            { size: 42, stock: 5 },
            { size: 43, stock: 4 },
            { size: 44, stock: 0 },
        ],
        createdAt: new Date("2025-12-05"),
    },
    {
        title: "Superga 2750 Cotu Classic",
        description: "The iconic Italian canvas plimsoll in crisp white, a wardrobe staple that pairs with everything from jeans to summer dresses.",
        price: 65,
        brand: "Superga",
        category: "shoes",
        gender: "women",
        imageProd: "https://images.unsplash.com/photo-1608053874302-694caf700023?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 36, stock: 6 },
            { size: 37, stock: 6 },
            { size: 38, stock: 5 },
            { size: 39, stock: 4 },
            { size: 40, stock: 0 },
        ],
        createdAt: new Date("2025-12-22"),
    },
    {
        title: "Clarks Un Loafer",
        description: "Slip-on leather loafer with Clarks' Cushion Plus insole, a smart-casual go-to for the office or dinner out.",
        price: 115,
        brand: "Clarks",
        category: "shoes",
        gender: "men",
        imageProd: "https://images.unsplash.com/photo-1777987601447-266e128de448?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 40, stock: 5 },
            { size: 41, stock: 5 },
            { size: 42, stock: 4 },
            { size: 43, stock: 3 },
            { size: 44, stock: 0 },
        ],
        createdAt: new Date("2026-01-10"),
    },
    {
        title: "Clarks Fawn Sparkle Mary-Jane",
        description: "Glitter-finish mary-jane flat with an adjustable buckle strap and a cushioned sole, dressy enough for school photos and sturdy enough for the playground.",
        price: 45,
        brand: "Clarks",
        category: "shoes",
        gender: "kids",
        imageProd: "https://images.unsplash.com/photo-1777307224337-9bdd87591433?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 28, stock: 6 },
            { size: 29, stock: 6 },
            { size: 30, stock: 5 },
            { size: 31, stock: 4 },
            { size: 32, stock: 0 },
            { size: 33, stock: 3 },
        ],
        createdAt: new Date("2026-01-28"),
    },

    // --- Bottes ---
    {
        title: "Timberland 6-Inch Premium Waterproof Boot",
        description: "The original waterproof leather boot with seam-sealed construction and anti-fatigue cushioning, built for rain, mud, and everything between.",
        price: 210,
        brand: "Timberland",
        category: "shoes",
        gender: "men",
        imageProd: "https://images.unsplash.com/photo-1549660299-31c4ea5f34c2?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 40, stock: 5 },
            { size: 41, stock: 6 },
            { size: 42, stock: 6 },
            { size: 43, stock: 4 },
            { size: 44, stock: 2 },
            { size: 45, stock: 0 },
        ],
        createdAt: new Date("2026-02-14"),
    },
    {
        title: "Dr. Martens 2976 Chelsea Boot",
        description: "Women's smooth leather Chelsea boot with elastic side gussets and the signature air-cushioned sole, easy to pull on and hard to wear out.",
        price: 175,
        brand: "Dr. Martens",
        category: "shoes",
        gender: "women",
        imageProd: "https://images.unsplash.com/photo-1615737168659-247ede7a7c9b?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 36, stock: 5 },
            { size: 37, stock: 5 },
            { size: 38, stock: 4 },
            { size: 39, stock: 3 },
            { size: 40, stock: 0 },
        ],
        createdAt: new Date("2026-03-03"),
    },
    {
        title: "Frye Jackson Chelsea Boot",
        description: "Men's full-grain leather Chelsea boot, hand-burnished with a stacked leather heel for a boot that only looks better with age.",
        price: 260,
        brand: "Frye",
        category: "shoes",
        gender: "men",
        imageProd: "https://images.unsplash.com/photo-1773425975272-35f0900a9d8f?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 40, stock: 4 },
            { size: 41, stock: 5 },
            { size: 42, stock: 5 },
            { size: 43, stock: 3 },
            { size: 44, stock: 2 },
        ],
        createdAt: new Date("2026-03-25"),
    },

    // --- Sandales ---
    {
        title: "Birkenstock Arizona",
        description: "The classic two-strap sandal with a contoured cork-latex footbed that molds to your foot over time, adjustable buckles for a custom fit.",
        price: 110,
        brand: "Birkenstock",
        category: "shoes",
        gender: "men",
        imageProd: "https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 40, stock: 6 },
            { size: 41, stock: 6 },
            { size: 42, stock: 5 },
            { size: 43, stock: 4 },
            { size: 44, stock: 0 },
        ],
        createdAt: new Date("2026-04-12"),
    },
    {
        title: "Birkenstock Gizeh",
        description: "Women's toe-post sandal on the same contoured cork footbed as the Arizona, a warm-weather essential.",
        price: 95,
        brand: "Birkenstock",
        category: "shoes",
        gender: "women",
        imageProd: "https://images.unsplash.com/photo-1628626126093-97c2c464ca5d?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 36, stock: 6 },
            { size: 37, stock: 6 },
            { size: 38, stock: 5 },
            { size: 39, stock: 4 },
            { size: 40, stock: 0 },
        ],
        createdAt: new Date("2026-05-01"),
    },
    {
        title: "Havaianas Top",
        description: "The original Brazilian flip-flop, with a textured rice-pattern footbed and soft rubber straps that get more comfortable with wear.",
        price: 28,
        brand: "Havaianas",
        category: "shoes",
        gender: "men",
        imageProd: "https://images.unsplash.com/photo-1567347167012-29482aa7a9a8?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 40, stock: 8 },
            { size: 41, stock: 8 },
            { size: 42, stock: 6 },
            { size: 43, stock: 5 },
            { size: 44, stock: 4 },
        ],
        createdAt: new Date("2026-05-20"),
    },

    // --- Chaussures de sport techniques ---
    {
        title: "Adidas Predator Accuracy",
        description: "Technical firm-ground football boot with a soft synthetic upper for touch and control, built for players who dictate the game.",
        price: 120,
        brand: "Adidas",
        category: "shoes",
        gender: "men",
        imageProd: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 40, stock: 5 },
            { size: 41, stock: 5 },
            { size: 42, stock: 5 },
            { size: 43, stock: 4 },
            { size: 44, stock: 2 },
            { size: 45, stock: 0 },
        ],
        createdAt: new Date("2026-06-15"),
    },
    {
        title: "Puma RS-X Efekt",
        description: "Chunky retro-tech sneaker with layered foam cushioning and a rugged R-System outsole, built for all-day wear on and off the track.",
        price: 125,
        brand: "Puma",
        category: "shoes",
        gender: "men",
        imageProd: "https://images.unsplash.com/photo-1750270438660-f57de76532cc?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 40, stock: 5 },
            { size: 41, stock: 6 },
            { size: 42, stock: 5 },
            { size: 43, stock: 4 },
            { size: 44, stock: 0 },
        ],
        createdAt: new Date("2026-07-08"),
    },
    {
        title: "Adidas Ultraboost Light",
        description: "Women's premium running shoe with Boost midsole cushioning and a Primeknit upper for an adaptive, sock-like fit.",
        price: 190,
        brand: "Adidas",
        category: "shoes",
        gender: "women",
        imageProd: "https://images.unsplash.com/photo-1555972635-8a10402b49b2?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 36, stock: 5 },
            { size: 37, stock: 5 },
            { size: 38, stock: 4 },
            { size: 39, stock: 3 },
            { size: 40, stock: 0 },
        ],
        createdAt: new Date("2026-08-02"),
    },
    {
        title: "Puma Smash 3.0",
        description: "Clean white leather court sneaker with the signature Formstrip and a durable rubber cupsole, a versatile everyday trainer that pairs with anything.",
        price: 90,
        brand: "Puma",
        category: "shoes",
        gender: "women",
        imageProd: "https://images.unsplash.com/photo-1715003132895-b10a23d3c90f?q=80&w=1200&auto=format&fit=crop",
        sizes: [
            { size: 36, stock: 6 },
            { size: 37, stock: 6 },
            { size: 38, stock: 5 },
            { size: 39, stock: 4 },
            { size: 40, stock: 0 },
        ],
        createdAt: new Date("2026-08-25"),
    },
];

const seed = async () => {
    await connectDB();

    // Retire l'ancien catalogue sneakers avant de repeupler
    const { deletedCount } = await Product.deleteMany({ imageProd: { $in: legacyImageUrls } });
    console.log(`- ${deletedCount} ancien(s) produit(s) sneakers supprimé(s).`);

    let created = 0;
    let skipped = 0;

    for (const product of products) {
        try {
            // Mongoose 9 a renomme l'ancienne option "rawResult" en
            // "includeResultMetadata" pour findOneAndUpdate (l'ancien nom est
            // silencieusement ignore et fait planter la detection insert/skip).
            // "overwriteImmutable" est necessaire car le plugin timestamps de
            // Mongoose remplace sinon silencieusement notre createdAt manuel
            // (dans $setOnInsert) par la date du jour, ce qui rendrait
            // ?sort=newest inutile puisque tous les produits auraient la meme date.
            const result = await Product.findOneAndUpdate(
                { imageProd: product.imageProd },
                { $setOnInsert: product },
                { upsert: true, includeResultMetadata: true, overwriteImmutable: true }
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

    console.log(`\nTerminé : ${deletedCount} supprimé(s), ${created} créé(s), ${skipped} déjà présent(s).`);
    await mongoose.disconnect();
    process.exit(0);
};

seed().catch((error) => {
    console.error("Le seed a échoué :", error);
    process.exit(1);
});
