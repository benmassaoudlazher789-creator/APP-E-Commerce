const jwt = require("jsonwebtoken");
const User = require("../model/User");

// identifie l'utilisateur si un token valide est fourni, sans bloquer la requete sinon (checkout invite autorise)
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (!token) return next();
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const foundUser = await User.findById(decode.id);
        if (foundUser) req.user = foundUser;
    } catch (error) {
        // token invalide ou expire -> on continue en tant qu'invite
    }
    next();
};

module.exports = optionalAuth;
