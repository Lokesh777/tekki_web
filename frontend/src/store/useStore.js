import { create } from 'zustand';
import api from '@/lib/api';

const useStore = create((set, get) => ({
  user: null,
  projects: [],
  currentProject: null,
  tasks: [],
  loading: false,
  error: null,
  authChecked: false,

  setUser: (user) => set({ user }),

  login: (user) => {
    set({ user });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore error
    }
    set({ user: null, projects: [], currentProject: null, tasks: [] });
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.data, authChecked: true });
      return true;
    } catch (err) {
      set({ user: null, authChecked: true });
      return false;
    }
  },

  setProjects: (projects) => set({ projects }),

  addProject: (project) => set((state) => ({
    projects: [project, ...state.projects]
  })),

  updateProject: (projectId, updates) => set((state) => ({
    projects: state.projects.map(p =>
      p._id === projectId ? { ...p, ...updates } : p
    ),
    currentProject: state.currentProject?._id === projectId
      ? { ...state.currentProject, ...updates }
      : state.currentProject
  })),

  removeProject: (projectId) => set((state) => ({
    projects: state.projects.filter(p => p._id !== projectId),
    currentProject: state.currentProject?._id === projectId ? null : state.currentProject
  })),

  setCurrentProject: (project) => set({ currentProject: project }),

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => set((state) => ({
    tasks: [task, ...state.tasks]
  })),

  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(t =>
      t._id === taskId ? { ...t, ...updates } : t
    )
  })),

  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map(t =>
      t._id === taskId ? { ...t, status } : t
    )
  })),

  removeTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(t => t._id !== taskId)
  })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

export default useStore;
