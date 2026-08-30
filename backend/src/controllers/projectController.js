const projectService = require('../services/projectService');

exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await projectService.createProject(name, description, req.user._id);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getUserProjects(req.user._id);
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user._id);
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await projectService.updateProject(
      req.params.id,
      { name, description },
      req.user._id
    );
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id, req.user._id);
    
    res.status(200).json({
      success: true,
      data: {},
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { memberId, role } = req.body;
    const project = await projectService.addMember(req.params.id, memberId, role);
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const project = await projectService.removeMember(req.params.id, req.params.memberId);
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};
