const Team = require("../models/Team");
const Project = require("../models/Project");
const Task = require("../models/Task");

const ROLE = {
  OWNER: "Owner",
  TEAM_LEAD: "TeamLead",
  INTERN: "Intern",
};

const normalizeRole = (role) => {
  if (role === "Member") return ROLE.INTERN;
  return role;
};

const toId = (value) => value?._id?.toString?.() || value?.toString?.();

const getTeamMembership = (team, userId) => {
  const id = toId(userId);
  const ownerId = toId(team.owner);

  if (ownerId === id) {
    return { role: ROLE.OWNER, member: null };
  }

  const member = (team.members || []).find((entry) => toId(entry.user) === id);
  if (!member) return null;

  return {
    role: normalizeRole(member.role),
    member,
  };
};

const requireTeamAccess = async (teamId, userId, allowedRoles = []) => {
  const team = await Team.findById(teamId);
  if (!team) {
    const error = new Error("Team not found");
    error.statusCode = 404;
    throw error;
  }

  const membership = getTeamMembership(team, userId);
  if (!membership) {
    const error = new Error("Access denied to this team");
    error.statusCode = 403;
    throw error;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
    const error = new Error("Insufficient team permissions");
    error.statusCode = 403;
    throw error;
  }

  return { team, role: membership.role };
};

const getTeamRole = async (userId, teamId) => {
  const { role } = await requireTeamAccess(teamId, userId);
  return role;
};

const requireTeamMember = (resolveTeamId) => async (req, res, next) => {
  try {
    const teamId = typeof resolveTeamId === "function" ? resolveTeamId(req) : req.params.id;
    const access = await requireTeamAccess(teamId, req.user._id);
    req.team = access.team;
    req.teamRole = access.role;
    next();
  } catch (error) {
    res.status(error.statusCode || 403).json({
      success: false,
      message: error.message,
    });
  }
};

const requireTeamRole = (roles = [], resolveTeamId) => async (req, res, next) => {
  try {
    const teamId = typeof resolveTeamId === "function" ? resolveTeamId(req) : req.params.id;
    const access = await requireTeamAccess(teamId, req.user._id, roles);
    req.team = access.team;
    req.teamRole = access.role;
    next();
  } catch (error) {
    res.status(error.statusCode || 403).json({
      success: false,
      message: error.message,
    });
  }
};

const requireProjectAccess = async (projectId, userId, allowedRoles = []) => {
  const project = await Project.findById(projectId).populate("team", "teamName owner members");
  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  if (!project.team) {
    const hasLegacyOwnerAccess = toId(project.owner) === toId(userId);
    if (!hasLegacyOwnerAccess) {
      const error = new Error("Access denied to this project");
      error.statusCode = 403;
      throw error;
    }
    return { project, team: null, role: ROLE.OWNER };
  }

  const membership = getTeamMembership(project.team, userId);
  if (!membership) {
    const error = new Error("Access denied to this project");
    error.statusCode = 403;
    throw error;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
    const error = new Error("Insufficient project permissions");
    error.statusCode = 403;
    throw error;
  }

  return { project, team: project.team, role: membership.role };
};

const requireTaskAccess = async (taskId, userId, allowedRoles = []) => {
  const task = await Task.findById(taskId)
    .populate("project", "projectName team owner")
    .populate("assignee", "fullName email")
    .populate("createdBy", "fullName email")
    .populate("comments.user", "fullName email");

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  if (!task.project) {
    const isLegacyParticipant =
      toId(task.createdBy) === toId(userId) || toId(task.assignee) === toId(userId);
    if (!isLegacyParticipant) {
      const error = new Error("Access denied to this task");
      error.statusCode = 403;
      throw error;
    }
    return { task, project: null, team: null, role: ROLE.OWNER };
  }

  const { project, team, role } = await requireProjectAccess(task.project._id, userId);
  if (role === ROLE.INTERN && toId(task.assignee) !== toId(userId)) {
    const error = new Error("Access denied to this task");
    error.statusCode = 403;
    throw error;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const error = new Error("Insufficient task permissions");
    error.statusCode = 403;
    throw error;
  }

  return { task, project, team, role };
};

const isTeamMember = (team, userId) => Boolean(getTeamMembership(team, userId));

const getAccessibleTeamIds = async (userId) => {
  const teams = await Team.find({ "members.user": userId }).select("_id");
  return teams.map((team) => team._id);
};

const getAccessibleProjectIds = async (userId) => {
  const teamIds = await getAccessibleTeamIds(userId);
  const projects = await Project.find({
    $or: [
      { team: { $in: teamIds } },
      { owner: userId, team: { $exists: false } },
    ],
  }).select("_id");

  return projects.map((project) => project._id);
};

const getAccessibleProjectsByRole = async (userId) => {
  const teamIds = await getAccessibleTeamIds(userId);
  const projects = await Project.find({
    $or: [
      { team: { $in: teamIds } },
      { owner: userId, team: { $exists: false } },
    ],
  }).populate("team", "owner members");

  const managerProjectIds = [];
  const internProjectIds = [];

  projects.forEach((project) => {
    if (!project.team) {
      managerProjectIds.push(project._id);
      return;
    }

    const membership = getTeamMembership(project.team, userId);
    if ([ROLE.OWNER, ROLE.TEAM_LEAD].includes(membership?.role)) {
      managerProjectIds.push(project._id);
    } else if (membership?.role === ROLE.INTERN) {
      internProjectIds.push(project._id);
    }
  });

  return { managerProjectIds, internProjectIds };
};

const getManagedTeamIds = async (userId) => {
  const teams = await Team.find({ "members.user": userId }).select("owner members");
  return teams
    .filter((team) => [ROLE.OWNER, ROLE.TEAM_LEAD].includes(getTeamMembership(team, userId)?.role))
    .map((team) => team._id);
};

const getManagedProjectIds = async (userId) => {
  const teamIds = await getManagedTeamIds(userId);
  const projects = await Project.find({
    $or: [
      { team: { $in: teamIds } },
      { owner: userId, team: { $exists: false } },
    ],
  }).select("_id");

  return projects.map((project) => project._id);
};

module.exports = {
  ROLE,
  normalizeRole,
  toId,
  getTeamMembership,
  getTeamRole,
  isTeamMember,
  requireTeamAccess,
  requireTeamMember,
  requireTeamRole,
  requireProjectAccess,
  requireTaskAccess,
  getAccessibleTeamIds,
  getAccessibleProjectIds,
  getAccessibleProjectsByRole,
  getManagedTeamIds,
  getManagedProjectIds,
};
