const { check, validationResult } = require("express-validator");
exports.registerValidation = () => [
    check("name", "Not valid").notEmpty(),
    check("email").isEmail().withMessage("Please provide a valid email"),
    check("password").isLength({ min: 6, max: 32 }).withMessage("Password must be between 6 and 32 characters"),
];
exports.loginValidation = () => [
    check("email").isEmail().withMessage("Please provide a valid email"),
    check("password").isLength({ min: 6, max: 32 }).withMessage("Password must be between 6 and 32 characters"),
];
exports.validation = (req, res, next) => {
    const errors = validationResult(req);
    errors.isEmpty() ? next() : res.status(400).json({ errors: errors.array() });
};