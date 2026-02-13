const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');
const Task = require('../models/Task');

// Middleware kiểm tra đăng nhập
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  res.redirect('/login');
};

// Trang chủ - Todo List
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.session.userId })
      .populate('createdBy', 'username fullName')
      .sort({ createdAt: -1 });

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.isDone).length;
    const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    res.render('index', {
      tasks,
      totalTasks,
      doneTasks,
      progress,
      user: { fullName: req.session.fullName, username: req.session.username }
    });
  } catch (error) {
    req.flash('error', error.message);
    res.render('index', { tasks: [], totalTasks: 0, doneTasks: 0, progress: 0, user: req.session });
  }
});

// Login page
router.get('/login', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/');
  res.render('login');
});

// Register page
router.get('/register', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/');
  res.render('register');
});

// Auth actions
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// Task actions
router.post('/tasks', isAuthenticated, taskController.createTask);
router.post('/tasks/:id/toggle', isAuthenticated, taskController.toggleTask);
router.post('/tasks/:id/delete', isAuthenticated, taskController.deleteTask);

module.exports = router;
