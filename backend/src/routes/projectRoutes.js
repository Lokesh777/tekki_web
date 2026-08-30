const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const taskRoutes = require('./taskRoutes');

const router = express.Router();

router.use(protect);

router.post('/', [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').optional().trim().isLength({ max: 500 }),
  validate
], projectController.createProject);

router.get('/', projectController.getUserProjects);

router.get('/:id', projectController.getProjectById);

router.put('/:id', [
  body('name').optional().trim().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  validate
], projectController.updateProject);

router.delete('/:id', projectController.deleteProject);

router.post('/:id/members', [
  body('memberId').notEmpty().withMessage('Member ID is required'),
  validate
], projectController.addMember);

router.delete('/:id/members/:memberId', projectController.removeMember);

router.use('/:projectId/tasks', taskRoutes);

module.exports = router;
