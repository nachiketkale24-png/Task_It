const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createTeam,
  getMyTeams,
  getTeamById,
  updateTeam,
  inviteMember,
  removeMember,
  leaveTeam,
  deleteTeam,
} = require("../controllers/teamController");

const {
  createTeamValidator,
} = require("../validators/teamValidator");

router.post(
  "/",
  protect,
  createTeamValidator,
  createTeam
);

router.get(
  "/",
  protect,
  getMyTeams
);

router.get(
  "/:id",
  protect,
  getTeamById
);

router.put(
  "/:id",
  protect,
  updateTeam
);

router.post(
  "/:id/invite",
  protect,
  inviteMember
);

router.delete(
  "/:id/leave",
  protect,
  leaveTeam
);

router.delete(
  "/:id/member/:userId",
  protect,
  removeMember
);

router.delete(
  "/:id",
  protect,
  deleteTeam
);

module.exports = router;
