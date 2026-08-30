const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
