const taskService = require('../services/taskService');

exports.createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(
      req.params.projectId,
      req.body,
      req.user._id
    );
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.getProjectTasks = async (req, res, next) => {
  try {
    const { status, assignee } = req.query;
    const tasks = await taskService.getProjectTasks(
      req.params.projectId,
      req.user._id,
      { status, assignee }
    );
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user._id);
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user._id);
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await taskService.updateTaskStatus(req.params.id, status, req.user._id);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user._id);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
