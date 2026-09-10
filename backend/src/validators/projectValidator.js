const { body } = require('express-validator');

const createProjectValidator = [
    body('team')
        .optional()
        .isMongoId()
        .withMessage('Team must be a valid MongoDB Team ID'),

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
