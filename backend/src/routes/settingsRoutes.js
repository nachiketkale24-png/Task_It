const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getProfile,
    updateProfile,
    changePassword,
    getNotificationPrefs,
    updateNotificationPrefs,
} = require("../controllers/settingsController");

router.use(protect);

router.route("/profile").get(getProfile).put(updateProfile);
router.put("/change-password", changePassword);
router.route("/notifications").get(getNotificationPrefs).put(updateNotificationPrefs);

module.exports = router;
