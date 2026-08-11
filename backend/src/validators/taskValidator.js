const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .trim(),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical'),

  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed'),

  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date'),

  body('assignee')
    .optional()
    .isMongoId()
    .withMessage('Assignee must be a valid MongoDB User ID')
];

const updateTaskValidator = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .trim(),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical'),

  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed'),

  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date'),

  body('assignee')
    .optional()
    .custom((value) => {
      if (value === null || value === '') return true;
      const mongoose = require('mongoose');
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage('Assignee must be a valid MongoDB User ID or null')
];

module.exports = {
  createTaskValidator,
  updateTaskValidator
};
