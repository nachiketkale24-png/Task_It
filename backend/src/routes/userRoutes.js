const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getUsers, getUser, createUser, updateUser,
    deleteUser, assignRole, toggleActivate,
} = require("../controllers/userController");

router.use(protect);

router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.put("/:id/role", assignRole);
router.put("/:id/deactivate", toggleActivate);

module.exports = router;
