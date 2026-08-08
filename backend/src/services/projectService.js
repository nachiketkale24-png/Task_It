const Project = require('../models/Project');

const createProject = async (data, userId) => {
  return await Project.create({
    ...data,
    owner: userId,
  });
};

const getAllProjects = async (userId) => {
  return await Project.find({ owner: userId })
    .sort({ createdAt: -1 });
};

const getProjectById = async (projectId, userId) => {
  return await Project.findOne({
    _id: projectId,
    owner: userId,
  });
};

const updateProject = async (projectId, userId, data) => {
  return await Project.findOneAndUpdate(
    { _id: projectId, owner: userId },
    data,
    { returnDocument: 'after', runValidators: true }
  );
};

const deleteProject = async (projectId, userId) => {
  return await Project.findOneAndDelete({
    _id: projectId,
    owner: userId,
  });
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};