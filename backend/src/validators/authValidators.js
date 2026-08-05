const { body } = require("express-validator");

const registerValidator = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required"),

    body("email")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("role")
        .optional()
        .isIn([
            "Super Admin",
            "Project Manager",
            "Team Lead",
            "Intern",
        ])
        .withMessage("Invalid role"),
];

const loginValidator = [
    body("email")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

module.exports = {
    registerValidator,
    loginValidator,
};