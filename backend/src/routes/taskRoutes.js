const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  createTaskValidator,
  updateTaskValidator
} = require('../validators/taskValidator');

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  addComment,
  deleteComment,
  addAttachment,
  deleteAttachment
} = require('../controllers/taskController');

// All endpoints inside this file are protected by JSON Web Token verification
router.use(protect);

// Task CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTaskValidator, validate, createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTaskValidator, validate, updateTask)
  .delete(deleteTask);

// Subtask routes
router.post('/:id/subtasks', addSubtask);
router.route('/:id/subtasks/:subtaskId')
  .put(toggleSubtask)
  .delete(deleteSubtask);

// Comment routes
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);

// Attachment routes
router.post('/:id/attachments', addAttachment);
router.delete('/:id/attachments/:attachmentId', deleteAttachment);

module.exports = router;
