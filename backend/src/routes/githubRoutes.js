const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getLinkedProjects,
    setProjectRepo,
    getRepoInfo,
    getAllProjects,
} = require("../controllers/githubController");

router.use(protect);

router.get("/projects", getLinkedProjects);
router.get("/all-projects", getAllProjects);
router.put("/projects/:id/repo", setProjectRepo);
router.get("/repo-info", getRepoInfo);

module.exports = router;
