const Project = require('../models/Project');
const Task = require('../models/Task');
const {
  ROLE,
  getAccessibleTeamIds,
  requireProjectAccess,
  requireTeamAccess,
} = require('../utils/rbac');

const PROJECT_MANAGERS = [ROLE.OWNER, ROLE.TEAM_LEAD];

const createProject = async (data, userId) => {
  if (!data.team) {
    throw new Error('Team is required to create a project');
  }

  await requireTeamAccess(data.team, userId, PROJECT_MANAGERS);

  return await Project.create({
    ...data,
    owner: userId,
    team: data.team,
  });
};

const getAllProjects = async (userId, filters = {}) => {
  const teamIds = await getAccessibleTeamIds(userId);
  const query = {
    $or: [
      { team: { $in: teamIds } },
      { owner: userId, team: { $exists: false } },
    ],
  };

  if (filters.team) {
    await requireTeamAccess(filters.team, userId);
    query.team = filters.team;
    delete query.$or;
  }

  return await Project.find(query)
    .populate('owner', 'fullName email')
    .populate({
      path: 'team',
      select: 'teamName owner members',
      populate: { path: 'members.user', select: 'fullName email role' },
    })
    .sort({ createdAt: -1 });
};

const getProjectById = async (projectId, userId) => {
  const { project, role } = await requireProjectAccess(projectId, userId);
  const projectDetails = await Project.findById(project._id)
    .populate('owner', 'fullName email')
    .populate({
      path: 'team',
      select: 'teamName owner members',
      populate: { path: 'members.user', select: 'fullName email role' },
    });
  const taskQuery = { project: project._id };
  if (role === ROLE.INTERN) {
    taskQuery.assignee = userId;
  }

  const tasks = await Task.find(taskQuery)
    .populate('assignee', 'fullName email role')
    .populate('createdBy', 'fullName email role')
    .sort({ createdAt: -1 });

  return {
    ...projectDetails.toObject(),
    tasks,
  };
};

const updateProject = async (projectId, userId, data) => {
  const { project } = await requireProjectAccess(projectId, userId, PROJECT_MANAGERS);

  if (data.team && data.team.toString() !== project.team?._id?.toString()) {
    await requireTeamAccess(data.team, userId, PROJECT_MANAGERS);
  }

  Object.assign(project, data);
  await project.save();

  return await Project.findById(project._id)
    .populate('owner', 'fullName email')
    .populate({
      path: 'team',
      select: 'teamName owner members',
      populate: { path: 'members.user', select: 'fullName email role' },
    });
};

const deleteProject = async (projectId, userId) => {
  const { project, role } = await requireProjectAccess(projectId, userId, [ROLE.OWNER]);
  if (role !== ROLE.OWNER) {
    throw new Error('Only the team owner can delete projects');
  }

  const taskCount = await Task.countDocuments({ project: project._id });
  if (taskCount > 0) {
    const error = new Error('Delete this project tasks before deleting the project');
    error.statusCode = 400;
    throw error;
  }

  await Project.findByIdAndDelete(project._id);
  return true;
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
