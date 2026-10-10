const jwt = require("jsonwebtoken");
const User = require("../model/User");

// crée un utilisateur directement en base (mot de passe haché par le hook pre('save'))
const createUser = async (overrides = {}) => {
    const user = new User({
        name: "Test User",
        email: `user-${Date.now()}-${Math.random().toString(16).slice(2)}@test.local`,
        password: "secret123",
        ...overrides,
    });
    await user.save();
    return user;
};

// même format de token que auth.controller (payload { id }, signé avec SECRET_KEY)
const tokenFor = (user) => jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "2h" });

module.exports = { createUser, tokenFor };
