const Project = require('../models/Project');
const Task = require('../models/Task');

exports.createProject = async (name, description, ownerId) => {
  const project = await Project.create({
    name,
    description,
    owner: ownerId,
    members: [{ user: ownerId, role: 'admin' }]
  });
  
  return project;
};

exports.getUserProjects = async (userId) => {
  const projects = await Project.find({
    $or: [
      { owner: userId },
      { 'members.user': userId }
    ]
  })
  .populate('owner', 'name email')
  .populate('members.user', 'name email')
  .sort({ createdAt: -1 });
  
  const projectsWithCounts = await Promise.all(
    projects.map(async (project) => {
      const taskCount = await Task.countDocuments({ project: project._id });
      return { ...project.toObject(), taskCount };
    })
  );
  
  return projectsWithCounts;
};

exports.getProjectById = async (projectId, userId) => {
  const project = await Project.findById(projectId)
    .populate('owner', 'name email')
    .populate('members.user', 'name email');
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  const userIdStr = userId.toString();
  const isMember = project.owner._id.toString() === userIdStr ||
    project.members.some(m => m.user._id.toString() === userIdStr);
  
  if (!isMember) {
    throw new Error('Not authorized to access this project');
  }
  
  const tasks = await Task.find({ project: projectId })
    .populate('assignee', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
  
  return { ...project.toObject(), tasks };
};

exports.updateProject = async (projectId, updates, userId) => {
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  const userIdStr = userId.toString();
  if (project.owner.toString() !== userIdStr) {
    const member = project.members.find(
      m => m.user.toString() === userIdStr && m.role === 'admin'
    );
    
    if (!member) {
      throw new Error('Not authorized to update this project');
    }
  }
  
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $set: updates },
    { new: true, runValidators: true }
  )
  .populate('owner', 'name email')
  .populate('members.user', 'name email');
  
  return updatedProject;
};

exports.deleteProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  if (project.owner.toString() !== userId.toString()) {
    throw new Error('Only the project owner can delete this project');
  }
  
  await Task.deleteMany({ project: projectId });
  await Project.findByIdAndDelete(projectId);
  
  return {};
};

exports.addMember = async (projectId, memberId, role = 'member') => {
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  const isMember = project.members.some(
    m => m.user.toString() === memberId
  );
  
  if (isMember) {
    throw new Error('User is already a member of this project');
  }
  
  project.members.push({ user: memberId, role });
  await project.save();
  
  return project;
};

exports.removeMember = async (projectId, memberId) => {
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  if (project.owner.toString() === memberId) {
    throw new Error('Cannot remove the project owner');
  }
  
  project.members = project.members.filter(
    m => m.user.toString() !== memberId
  );
  await project.save();
  
  return project;
};
