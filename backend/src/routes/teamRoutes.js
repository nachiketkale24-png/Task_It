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
  updateMemberRole,
  leaveTeam,
  deleteTeam,
} = require("../controllers/teamController");

const {
  createTeamValidator,
  updateTeamValidator,
  inviteMemberValidator,
} = require("../validators/teamValidator");

const validate = require("../middleware/validationMiddleware");

router.post(
  "/",
  protect,
  createTeamValidator,
  validate,
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
  updateTeamValidator,
  validate,
  updateTeam
);

router.post(
  "/:id/invite",
  protect,
  inviteMemberValidator,
  validate,
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

router.patch(
  "/:id/member/:userId/role",
  protect,
  updateMemberRole
);

router.delete(
  "/:id",
  protect,
  deleteTeam
);

module.exports = router;
