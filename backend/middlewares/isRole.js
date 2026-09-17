// a utiliser apres isAuth (qui charge req.user) : 403 si le role de
// l'utilisateur connecte ne fait pas partie des roles autorises
const isRole = (...allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
};

module.exports = isRole;
