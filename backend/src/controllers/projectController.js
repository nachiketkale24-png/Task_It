
const projectService = require('../services/projectService');

const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(
      req.body,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  const projects = await projectService.getAllProjects(req.user._id);

  res.json({
    success: true,
    count: projects.length,
    data: projects,
  });
};

const getProject = async (req, res) => {
  const project = await projectService.getProjectById(
    req.params.id,
    req.user._id
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  res.json({
    success: true,
    data: project,
  });
};

const updateProject = async (req, res) => {
  const project = await projectService.updateProject(
    req.params.id,
    req.user._id,
    req.body
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  res.json({
    success: true,
    message: 'Project updated',
    data: project,
  });
};

const deleteProject = async (req, res) => {
  const project = await projectService.deleteProject(
    req.params.id,
    req.user._id
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  res.json({
    success: true,
    message: 'Project deleted',
  });
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
};