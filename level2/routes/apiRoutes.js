const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// API routes
router.get('/api/tasks', taskController.getAllTasks);
router.get('/api/tasks/by-user/:username', taskController.getTasksByUser);
router.get('/api/tasks/today', taskController.getTasksToday);
router.get('/api/tasks/incomplete', taskController.getIncompleteTasks);
router.get('/api/tasks/nguyen', taskController.getTasksByNguyen);

module.exports = router;
