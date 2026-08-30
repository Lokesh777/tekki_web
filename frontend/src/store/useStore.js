import { create } from 'zustand';

const useStore = create((set, get) => ({
  user: null,
  token: null,
  projects: [],
  currentProject: null,
  tasks: [],
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
    set({ token });
  },
  
  login: (user, token) => {
    set({ user, token });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  
  logout: () => {
    set({ user: null, token: null, projects: [], currentProject: null, tasks: [] });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
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
