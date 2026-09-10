const { body } = require("express-validator");

const SELF_REGISTRATION_ROLES = [
    "Project Manager",
    "Team Lead",
    "Developer",
    "Intern",
];

const registerValidator = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required"),

    body("email")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(SELF_REGISTRATION_ROLES)
        .withMessage("Invalid registration role"),
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
    SELF_REGISTRATION_ROLES,
};
