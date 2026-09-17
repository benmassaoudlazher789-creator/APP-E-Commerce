// Script ponctuel : change le role d'un utilisateur via son email. Necessaire
// pour tester le dashboard admin (aucune UI ne permet de se promouvoir
// soi-meme, et aucun compte n'a le role "admin" par defaut).
//
// Usage : node scripts/setUserRole.js you@example.com admin

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/connectDB");
const User = require("../model/User");

const [, , email, role = "admin"] = process.argv;

const setRole = async () => {
    if (!email) {
        console.error("Usage : node scripts/setUserRole.js you@example.com [role]");
        process.exit(1);
    }
    if (!["user", "admin"].includes(role)) {
        console.error(`Role invalide : "${role}" (attendu "user" ou "admin")`);
        process.exit(1);
    }

    await connectDB();

    const user = await User.findOneAndUpdate({ email }, { $set: { role } }, { returnDocument: "after" });

    if (!user) {
        console.log(`Introuvable : ${email}`);
    } else {
        console.log(`${user.email} -> role: ${user.role}`);
    }

    await mongoose.disconnect();
    process.exit(user ? 0 : 1);
};

setRole().catch((error) => {
    console.error("Le script a echoue :", error);
    process.exit(1);
});
