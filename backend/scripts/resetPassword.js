// Script ponctuel : redefinit le mot de passe d'un utilisateur via son email
// (ex : mot de passe admin oublie, aucun service mail n'etant configure pour
// le flux "forgot password").
//
// Le nouveau mot de passe est demande dans le terminal (saisie masquee) et
// jamais passe en argument, pour qu'il n'apparaisse pas dans l'historique du shell.
//
// Usage : node scripts/resetPassword.js you@example.com
//    ou : npm run reset:password -- you@example.com

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const readline = require("readline");
const mongoose = require("mongoose");
const connectDB = require("../config/connectDB");
const User = require("../model/User");

const [, , email] = process.argv;

// memes bornes que updateProfile/resetPassword dans auth.controller.js
const MIN_LENGTH = 6;
const MAX_LENGTH = 32;

// lit une ligne sans afficher les caracteres tapes (une "*" par caractere).
// Si stdin n'est pas un terminal (entree redirigee), on retombe sur une lecture simple.
const askHidden = (question) =>
    new Promise((resolve) => {
        const { stdin, stdout } = process;

        if (!stdin.isTTY) {
            const rl = readline.createInterface({ input: stdin, terminal: false });
            stdout.write(question);
            rl.once("line", (line) => {
                rl.close();
                resolve(line);
            });
            return;
        }

        stdout.write(question);
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding("utf8");

        let input = "";
        const onData = (chunk) => {
            for (const char of chunk) {
                if (char === "\r" || char === "\n" || char === "\u0004") {
                    stdin.setRawMode(false);
                    stdin.pause();
                    stdin.removeListener("data", onData);
                    stdout.write("\n");
                    resolve(input);
                    return;
                }
                if (char === "\u0003") {
                    // Ctrl+C
                    stdin.setRawMode(false);
                    stdout.write("\nAnnule.\n");
                    process.exit(130);
                }
                if (char === "\u007f" || char === "\b") {
                    // retour arriere
                    if (input.length > 0) {
                        input = input.slice(0, -1);
                        stdout.write("\b \b");
                    }
                    continue;
                }
                input += char;
                stdout.write("*");
            }
        };
        stdin.on("data", onData);
    });

const resetPassword = async () => {
    if (!email) {
        console.error("Usage : node scripts/resetPassword.js you@example.com");
        process.exit(1);
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
        console.log(`Introuvable : ${email}`);
        await mongoose.disconnect();
        process.exit(1);
    }

    const password = await askHidden("Nouveau mot de passe : ");
    const confirm = await askHidden("Confirmer le mot de passe : ");

    // le schema User applique trim au mot de passe : on valide la valeur telle qu'elle sera hachee
    const trimmed = password.trim();
    let error = null;
    if (password !== confirm) {
        error = "Les mots de passe ne correspondent pas.";
    } else if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) {
        error = `Le mot de passe doit contenir entre ${MIN_LENGTH} et ${MAX_LENGTH} caracteres.`;
    }
    if (error) {
        console.error(error);
        await mongoose.disconnect();
        process.exit(1);
    }

    // meme chemin que l'inscription : le hook pre('save') du modele User hache
    // le mot de passe avec bcrypt (10 rounds). On invalide aussi un eventuel
    // token de reset encore en cours.
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`Mot de passe mis à jour pour ${user.email}`);

    await mongoose.disconnect();
    process.exit(0);
};

resetPassword().catch(async (error) => {
    // uniquement le message : l'objet d'erreur complet (ex : ValidationError)
    // peut contenir la valeur du champ password
    console.error("Le script a echoue :", error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
