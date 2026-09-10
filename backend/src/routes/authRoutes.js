const express = require("express");
const router = express.Router();
const { protect, requireGlobalRole } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const {
    registerUser,
    loginUser,
    getUsers,
} = require("../controllers/authController");

const {
    registerValidator,
    loginValidator,
} = require("../validators/authValidator");

router.post(
    "/register",
    registerValidator,
    validate,
    registerUser
);

router.post(
    "/login",
    loginValidator,
    validate,
    loginUser
);
router.get("/users", protect, requireGlobalRole(["Super Admin"]), getUsers);
module.exports = router;

router.get("/profile", protect, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});
