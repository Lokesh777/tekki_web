const mongoose = require('mongoose');
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Task = require('./src/models/Task');
const config = require('./src/config/config');

const seedData = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected for seeding...');

    // Create demo user
    let demoUser = await User.findOne({ email: 'lokesh@company.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Lokesh',
        email: 'lokesh@company.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Demo user created');
    } else {
      console.log('Demo user already exists');
    }

    // Create sample project
    let project = await Project.findOne({ owner: demoUser._id });
    if (!project) {
      project = await Project.create({
        name: 'Website Redesign',
        description: 'Complete overhaul of company website with modern design',
        owner: demoUser._id,
        members: [{ user: demoUser._id, role: 'admin' }]
      });
      console.log('Sample project created');

      // Create sample tasks
      await Task.create([
        { title: 'Design homepage mockup', description: 'Create wireframes and high-fidelity mockups', status: 'todo', priority: 'high', project: project._id, createdBy: demoUser._id },
        { title: 'Setup project repo', description: 'Initialize Git repository and CI/CD', status: 'done', priority: 'high', project: project._id, createdBy: demoUser._id },
        { title: 'Implement auth system', description: 'JWT-based authentication', status: 'in-progress', priority: 'medium', project: project._id, createdBy: demoUser._id },
        { title: 'Create API endpoints', description: 'RESTful API for all resources', status: 'todo', priority: 'medium', project: project._id, createdBy: demoUser._id },
        { title: 'Write tests', description: 'Unit and integration tests', status: 'todo', priority: 'low', project: project._id, createdBy: demoUser._id },
      ]);
      console.log('Sample tasks created');
    } else {
      console.log('Sample project already exists');
    }

    console.log('\nSeed completed!');
    console.log('Demo credentials: lokesh@company.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
