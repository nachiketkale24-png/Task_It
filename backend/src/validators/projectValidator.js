const { body } = require('express-validator');

const createProjectValidator = [
    body('projectName')
        .notEmpty()
        .withMessage('Project name is required'),

    body('description')
        .notEmpty()
        .withMessage('Description is required'),

    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High', 'Critical']),

    body('status')
        .optional()
        .isIn(['Planning', 'Active', 'On Hold', 'Completed']),
]; 

module.exports = { 
    createProjectValidator,
};