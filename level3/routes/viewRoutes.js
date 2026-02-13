const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');

// ==================== Auth Pages ====================
router.get('/login', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/');
  res.render('login');
});

router.get('/register', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/');
  res.render('register');
});

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// ==================== Main Todo Page ====================
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Lấy tasks mà user tạo HOẶC được phân công
    const tasks = await Task.find({
      $or: [
        { createdBy: req.session.userId },
        { assignedTo: req.session.userId }
      ]
    })
      .populate('createdBy', 'username fullName')
      .populate('assignedTo', 'username fullName')
      .populate('completedBy', 'username fullName')
      .sort({ createdAt: -1 });

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.isDone).length;
    const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    res.render('index', {
      tasks, totalTasks, doneTasks, progress,
      user: {
        id: req.session.userId,
        fullName: req.session.fullName,
        username: req.session.username,
        role: req.session.role
      }
    });
  } catch (error) {
    req.flash('error', error.message);
    res.render('index', {
      tasks: [], totalTasks: 0, doneTasks: 0, progress: 0,
      user: { id: req.session.userId, fullName: req.session.fullName, username: req.session.username, role: req.session.role }
    });
  }
});

// ==================== Admin Page ====================
router.get('/admin', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const tasks = await Task.find()
      .populate('createdBy', 'username fullName')
      .populate('assignedTo', 'username fullName role')
      .populate('completedBy', 'username fullName')
      .sort({ createdAt: -1 });

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.isDone).length;
    const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    res.render('admin', {
      users, tasks, totalTasks, doneTasks, progress,
      user: {
        id: req.session.userId,
        fullName: req.session.fullName,
        username: req.session.username,
        role: req.session.role
      }
    });
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/');
  }
});

// ==================== Task Actions ====================
router.post('/tasks', isAuthenticated, taskController.createTask);
router.post('/tasks/assign', isAuthenticated, isAdmin, taskController.createAndAssignTask);
router.post('/tasks/:id/toggle', isAuthenticated, taskController.toggleTask);
router.post('/tasks/:id/delete', isAuthenticated, taskController.deleteTask);

module.exports = router;
