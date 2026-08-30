'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import useStore from '@/store/useStore';
import { useSocket } from '@/hooks/useSocket';
import TaskColumn from './TaskColumn';
import CreateTask from './CreateTask';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';

const TaskBoard = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { currentProject, setCurrentProject, tasks, setTasks } = useStore();
  const { changeTaskStatus, notifyTaskCreated } = useSocket(projectId);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${projectId}`);
      setCurrentProject(response.data.data);
      setTasks(response.data.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      changeTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleTaskCreated = (newTask) => {
    notifyTaskCreated(projectId);
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/projects')}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => router.push('/projects')}
              className="text-gray-500 hover:text-gray-700 text-sm mb-2 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentProject?.name}
            </h1>
            {currentProject?.description && (
              <p className="text-gray-600 mt-1">
                {currentProject.description}
              </p>
            )}
          </div>
          
          <Button onClick={() => setShowCreateModal(true)}>
            + New Task
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="To Do"
            status="todo"
            tasks={todoTasks}
            onStatusChange={handleStatusChange}
          />
          <TaskColumn
            title="In Progress"
            status="in-progress"
            tasks={inProgressTasks}
            onStatusChange={handleStatusChange}
          />
          <TaskColumn
            title="Done"
            status="done"
            tasks={doneTasks}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
      
      <CreateTask
        projectId={projectId}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default TaskBoard;
