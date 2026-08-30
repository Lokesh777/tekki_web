const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const parseCookies = (cookieHeader) => {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      cookies[name.trim()] = rest.join('=').trim();
    });
  }
  return cookies;
};

const socketHandler = (io) => {
  io.use(async (socket, next) => {
    let token = socket.handshake.auth.token;

    if (!token && socket.handshake.headers.cookie) {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      token = cookies.token;
    }

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.userName = user.name;
      socket.userRole = user.role;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userName} (${socket.userId})`);
    
    socket.on('join-project', async (data) => {
      try {
        const { projectId } = data;
        
        const project = await Project.findById(projectId);
        
        if (!project) {
          socket.emit('error', { message: 'Project not found', code: 'NOT_FOUND' });
          return;
        }
        
        const isMember = project.owner.toString() === socket.userId ||
          project.members.some(m => m.user.toString() === socket.userId);
        
        if (!isMember) {
          socket.emit('error', { message: 'Access denied', code: 'AUTH_ERROR' });
          return;
        }
        
        socket.join(`project:${projectId}`);
        socket.currentProject = projectId;
        
        const tasks = await Task.find({ project: projectId })
          .populate('assignee', 'name email')
          .populate('createdBy', 'name email')
          .sort({ createdAt: -1 });
        
        const members = await Project.findById(projectId)
          .populate('members.user', 'name email');
        
        socket.emit('project-state', {
          projectId,
          tasks,
          members: members.members
        });
        
        console.log(`${socket.userName} joined project: ${projectId}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to join project', code: 'SERVER_ERROR' });
      }
    });
    
    socket.on('leave-project', (data) => {
      const { projectId } = data;
      socket.leave(`project:${projectId}`);
      socket.currentProject = null;
      console.log(`${socket.userName} left project: ${projectId}`);
    });
    
    socket.on('task-status-change', async (data) => {
      try {
        const { taskId, status } = data;
        
        const task = await Task.findById(taskId)
          .populate('assignee', 'name email')
          .populate('createdBy', 'name email');
        
        if (!task) {
          socket.emit('error', { message: 'Task not found', code: 'NOT_FOUND' });
          return;
        }
        
        const previousStatus = task.status;
        task.status = status;
        await task.save();
        
        io.to(`project:${task.project.toString()}`).emit('task-status-changed', {
          task: {
            _id: task._id,
            title: task.title,
            status: task.status,
            previousStatus,
            assignee: task.assignee,
            priority: task.priority
          },
          changedBy: socket.userName
        });
        
        console.log(`${socket.userName} changed task ${task.title} status: ${previousStatus} -> ${status}`);
      } catch (error) {
        socket.emit('error', { message: 'Failed to update task status', code: 'SERVER_ERROR' });
      }
    });
    
    socket.on('task-created', async (data) => {
      try {
        const { projectId } = data;
        
        const tasks = await Task.find({ project: projectId })
          .populate('assignee', 'name email')
          .populate('createdBy', 'name email')
          .sort({ createdAt: -1 });
        
        io.to(`project:${projectId}`).emit('project-state', {
          projectId,
          tasks
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to broadcast task creation', code: 'SERVER_ERROR' });
      }
    });
    
    socket.on('task-updated', async (data) => {
      try {
        const { projectId } = data;
        
        const tasks = await Task.find({ project: projectId })
          .populate('assignee', 'name email')
          .populate('createdBy', 'name email')
          .sort({ createdAt: -1 });
        
        io.to(`project:${projectId}`).emit('project-state', {
          projectId,
          tasks
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to broadcast task update', code: 'SERVER_ERROR' });
      }
    });
    
    socket.on('task-deleted', async (data) => {
      try {
        const { projectId } = data;
        
        const tasks = await Task.find({ project: projectId })
          .populate('assignee', 'name email')
          .populate('createdBy', 'name email')
          .sort({ createdAt: -1 });
        
        io.to(`project:${projectId}`).emit('project-state', {
          projectId,
          tasks
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to broadcast task deletion', code: 'SERVER_ERROR' });
      }
    });
    
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userName} (${socket.userId})`);
    });
  });
};

module.exports = socketHandler;
