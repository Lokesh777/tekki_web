const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/', taskController.getProjectTasks);

router.post('/', [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('assignee').optional().isMongoId(),
  body('dueDate').optional().isISO8601(),
  validate
], taskController.createTask);

module.exports = router;
