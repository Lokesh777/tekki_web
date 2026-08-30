const Task = require('../models/Task');
const Project = require('../models/Project');

const checkProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  const userIdStr = userId.toString();
  const isMember = project.owner.toString() === userIdStr ||
    project.members.some(m => m.user.toString() === userIdStr);
  
  if (!isMember) {
    throw new Error('Not authorized to access this project');
  }
  
  return project;
};

exports.createTask = async (projectId, taskData, userId) => {
  await checkProjectAccess(projectId, userId);
  
  const task = await Task.create({
    ...taskData,
    project: projectId,
    createdBy: userId
  });
  
  const populatedTask = await Task.findById(task._id)
    .populate('assignee', 'name email')
    .populate('createdBy', 'name email');
  
  return populatedTask;
};

exports.getProjectTasks = async (projectId, userId, filters = {}) => {
  await checkProjectAccess(projectId, userId);
  
  const query = { project: projectId };
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.assignee) {
    query.assignee = filters.assignee;
  }
  
  const tasks = await Task.find(query)
    .populate('assignee', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
  
  return tasks;
};

exports.getTaskById = async (taskId, userId) => {
  const task = await Task.findById(taskId)
    .populate('assignee', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name members');
  
  if (!task) {
    throw new Error('Task not found');
  }
  
  await checkProjectAccess(task.project._id, userId);
  
  return task;
};

exports.updateTask = async (taskId, updates, userId) => {
  const task = await Task.findById(taskId);
  
  if (!task) {
    throw new Error('Task not found');
  }
  
  await checkProjectAccess(task.project, userId);
  
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: updates },
    { new: true, runValidators: true }
  )
  .populate('assignee', 'name email')
  .populate('createdBy', 'name email');
  
  return updatedTask;
};

exports.updateTaskStatus = async (taskId, status, userId) => {
  const task = await Task.findById(taskId);
  
  if (!task) {
    throw new Error('Task not found');
  }
  
  await checkProjectAccess(task.project, userId);
  
  const previousStatus = task.status;
  
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: { status } },
    { new: true, runValidators: true }
  )
  .populate('assignee', 'name email')
  .populate('createdBy', 'name email');
  
  return { task: updatedTask, previousStatus };
};

exports.deleteTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  
  if (!task) {
    throw new Error('Task not found');
  }
  
  const project = await checkProjectAccess(task.project, userId);
  
  const isCreator = task.createdBy.toString() === userId.toString();
  const isAdmin = project.owner.toString() === userId.toString() ||
    project.members.some(m => m.user.toString() === userId.toString() && m.role === 'admin');
  
  if (!isCreator && !isAdmin) {
    throw new Error('Not authorized to delete this task');
  }
  
  await Task.findByIdAndDelete(taskId);
  
  return { projectId: task.project };
};
