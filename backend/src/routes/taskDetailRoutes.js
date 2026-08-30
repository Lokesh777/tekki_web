const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/tasks/:id', taskController.getTaskById);

router.put('/tasks/:id', [
  body('title').optional().trim().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('assignee').optional().isMongoId(),
  body('dueDate').optional().isISO8601(),
  validate
], taskController.updateTask);

router.patch('/tasks/:id/status', [
  body('status').isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  validate
], taskController.updateTaskStatus);

router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
