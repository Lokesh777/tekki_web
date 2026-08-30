import { io } from 'socket.io-client';

let socket = null;

const getWsUrl = () => {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:5000';
};

export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io(getWsUrl(), {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const joinProject = (projectId) => {
  if (socket?.connected) {
    socket.emit('join-project', { projectId });
  }
};

export const leaveProject = (projectId) => {
  if (socket?.connected) {
    socket.emit('leave-project', { projectId });
  }
};

export const emitTaskStatusChange = (taskId, status) => {
  if (socket?.connected) {
    socket.emit('task-status-change', { taskId, status });
  }
};

export const emitTaskCreated = (projectId) => {
  if (socket?.connected) {
    socket.emit('task-created', { projectId });
  }
};

export const emitTaskUpdated = (projectId) => {
  if (socket?.connected) {
    socket.emit('task-updated', { projectId });
  }
};

export const emitTaskDeleted = (projectId) => {
  if (socket?.connected) {
    socket.emit('task-deleted', { projectId });
  }
};

export const onProjectState = (callback) => {
  if (socket) {
    socket.on('project-state', callback);
  }
};

export const onTaskStatusChanged = (callback) => {
  if (socket) {
    socket.on('task-status-changed', callback);
  }
};

export const onTaskCreated = (callback) => {
  if (socket) {
    socket.on('task-created', callback);
  }
};

export const onTaskUpdated = (callback) => {
  if (socket) {
    socket.on('task-updated', callback);
  }
};

export const onSocketError = (callback) => {
  if (socket) {
    socket.on('error', callback);
  }
};

export const offProjectState = (callback) => {
  if (socket) {
    socket.off('project-state', callback);
  }
};

export const offTaskStatusChanged = (callback) => {
  if (socket) {
    socket.off('task-status-changed', callback);
  }
};
