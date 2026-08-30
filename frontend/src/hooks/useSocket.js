'use client';

import { useEffect, useCallback, useRef } from 'react';
import useStore from '@/store/useStore';
import {
  connectSocket,
  disconnectSocket,
  joinProject,
  leaveProject,
  emitTaskStatusChange,
  emitTaskCreated,
  emitTaskUpdated,
  emitTaskDeleted,
  onProjectState,
  onTaskStatusChanged,
  onSocketError
} from '@/lib/socket';

export const useSocket = (projectId = null) => {
  const { user, setTasks, updateTaskStatus } = useStore();
  const joinedProjects = useRef(new Set());

  useEffect(() => {
    if (user) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
      joinedProjects.current.clear();
    };
  }, [user]);

  useEffect(() => {
    if (projectId && user) {
      const socket = connectSocket();

      if (socket?.connected) {
        joinProject(projectId);
        joinedProjects.current.add(projectId);
      } else {
        socket?.on('connect', () => {
          joinProject(projectId);
          joinedProjects.current.add(projectId);
        });
      }

      const handleProjectState = (data) => {
        if (data.projectId === projectId) {
          setTasks(data.tasks);
        }
      };

      const handleTaskStatusChanged = (data) => {
        updateTaskStatus(data.task._id, data.task.status);
      };

      const handleError = (err) => {
        console.error('Socket error:', err);
      };

      onProjectState(handleProjectState);
      onTaskStatusChanged(handleTaskStatusChanged);
      onSocketError(handleError);

      return () => {
        leaveProject(projectId);
        joinedProjects.current.delete(projectId);
      };
    }
  }, [projectId, user, setTasks, updateTaskStatus]);

  const changeTaskStatus = useCallback((taskId, status) => {
    emitTaskStatusChange(taskId, status);
  }, []);

  const notifyTaskCreated = useCallback((projId) => {
    emitTaskCreated(projId);
  }, []);

  const notifyTaskUpdated = useCallback((projId) => {
    emitTaskUpdated(projId);
  }, []);

  const notifyTaskDeleted = useCallback((projId) => {
    emitTaskDeleted(projId);
  }, []);

  return {
    changeTaskStatus,
    notifyTaskCreated,
    notifyTaskUpdated,
    notifyTaskDeleted
  };
};

export default useSocket;
