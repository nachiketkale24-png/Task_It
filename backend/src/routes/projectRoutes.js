const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const {
  createProjectValidator,
  updateProjectValidator,
} = require('../validators/projectValidator');

router.use(protect);

router.post(
  '/',
  createProjectValidator,
  validate,
  createProject
);

router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', updateProjectValidator, validate, updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
