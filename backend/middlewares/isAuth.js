const jwt = require("jsonwebtoken");
const User = require("../model/User");


const isAuth = async (req, res, next) => {
    try {
    //recuperation du token dans le header de la requete
    const token = req.headers["authorization"];  
    
    //token n'existe pas
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    // si c'est le bon token
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    //user correspondant au token
    const foundUser = await User.findById(decode.id);
    if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
    }
    //response
    req.user = foundUser;
    next();
    } catch (error) {
        
            return res.status(401).json({ message: "Invalid or expired token" });
    }
}
module.exports = isAuth;