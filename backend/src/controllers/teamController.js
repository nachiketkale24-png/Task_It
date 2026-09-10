const Team = require("../models/Team");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const Project = require("../models/Project");
const { ROLE, normalizeRole, getTeamMembership } = require("../utils/rbac");

const TEAM_ROLES = [ROLE.OWNER, ROLE.TEAM_LEAD, ROLE.INTERN];

const handleTeamError = (res, error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode ? error.message : "Server Error",
  });
};

const ensureValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    return false;
  }
  return true;
};

const isOwner = (team, userId) => team.owner.toString() === userId.toString();

const createTeam = async (req, res) => {
  try {
    if (!ensureValidation(req, res)) return;

    const { teamName, description } = req.body;
    const team = await Team.create({
      teamName,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: ROLE.OWNER }],
    });

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team,
    });
  } catch (error) {
    console.error(error);
    return handleTeamError(res, error);
  }
};

const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ "members.user": req.user._id })
      .populate("owner", "fullName email")
      .populate("members.user", "fullName email");

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    console.error(error);
    return handleTeamError(res, error);
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("owner", "fullName email")
      .populate("members.user", "fullName email");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (!getTeamMembership(team, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const projects = await Project.find({ team: team._id })
      .populate("owner", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...team.toObject(),
        projects,
      },
    });
  } catch (error) {
    console.error(error);
    return handleTeamError(res, error);
  }
};

const updateTeam = async (req, res) => {
  try {
    if (!ensureValidation(req, res)) return;

    const { teamName, description } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (!isOwner(team, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can update the team",
      });
    }

    if (teamName !== undefined) team.teamName = teamName.trim();
    if (description !== undefined) team.description = description;

    await team.save();
    await team.populate("owner", "fullName email");
    await team.populate("members.user", "fullName email");

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: team,
    });
  } catch (error) {
    console.error(error);
    return handleTeamError(res, error);
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (!isOwner(team, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can delete the team",
      });
    }

    const projectCount = await Project.countDocuments({ team: team._id });
    if (projectCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Delete or move this team's projects before deleting the team",
      });
    }

    await team.deleteOne();

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return handleTeamError(res, error);
  }
};

const inviteMember = async (req, res) => {
  try {
    if (!ensureValidation(req, res)) return;

    const { email } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (!isOwner(team, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can invite members",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyMember = team.members.some(
      (member) => member.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member",
      });
    }

    team.members.push({
      user: user._id,
      role: ROLE.INTERN,
    });

    await team.save();
    await team.populate("owner", "fullName email");
    await team.populate("members.user", "fullName email");

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      data: team,
    });
  } catch (error) {
    console.error(error);
    return handleTeamError(res, error);
  }
};

const removeMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (!isOwner(team, req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can remove members",
      });
    }

    if (req.params.userId === team.owner.toString()) {
      return res.status(400).json({
        success: false,
        message: "Owner cannot be removed",
      });
    }

    const memberExists = team.members.some(
      (member) => member.user.toString() === req.params.userId
    );

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    team.members = team.members.filter(
      (member) => member.user.toString() !== req.params.userId
    );

    await team.save();

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error(error);
    return handleTeamError(res, error);
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const normalizedRole = normalizeRole(req.body.role);

    if (!TEAM_ROLES.includes(normalizedRole) || normalizedRole === ROLE.OWNER) {
      return res.status(400).json({
        success: false,
        message: "Role must be TeamLead or Intern",
      });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const requester = getTeamMembership(team, req.user._id);

    if (!requester || requester.role !== ROLE.OWNER) {
      return res.status(403).json({
        success: false,
        message: "Only the owner can change member roles",
      });
    }

    if (team.owner.toString() === req.params.userId) {
      return res.status(400).json({
        success: false,
        message: "Owner role cannot be changed here",
      });
    }

    const member = team.members.find(
      (entry) => entry.user.toString() === req.params.userId
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    member.role = normalizedRole;
    await team.save();
    await team.populate("owner", "fullName email");
    await team.populate("members.user", "fullName email");

    res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: team,
    });
  } catch (error) {
    console.error(error);
    return handleTeamError(res, error);
  }
};

const leaveTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (isOwner(team, req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "Owner cannot leave the team. Delete the team or transfer ownership.",
      });
    }

    const memberExists = team.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: "You are not a member of this team",
      });
    }

    team.members = team.members.filter(
      (member) => member.user.toString() !== req.user._id.toString()
    );

    await team.save();

    res.status(200).json({
      success: true,
      message: "You left the team successfully",
    });
  } catch (error) {
    console.error(error);
    return handleTeamError(res, error);
  }
};

module.exports = {
  createTeam,
  getMyTeams,
  getTeamById,
  updateTeam,
  inviteMember,
  removeMember,
  updateMemberRole,
  leaveTeam,
  deleteTeam,
};
