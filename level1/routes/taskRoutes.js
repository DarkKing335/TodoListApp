const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Lấy tất cả tasks
router.get('/', taskController.getAllTasks);

// Lấy tasks theo username
router.get('/by-user/:username', taskController.getTasksByUser);

// Lấy tasks trong ngày hiện tại
router.get('/today', taskController.getTasksToday);

// Lấy tasks chưa hoàn thành
router.get('/incomplete', taskController.getIncompleteTasks);

// Lấy tasks của user có họ Nguyễn
router.get('/nguyen', taskController.getTasksByNguyen);

// Tạo task mới
router.post('/', taskController.createTask);

// Đánh dấu hoàn thành / chưa hoàn thành
router.put('/:id/toggle', taskController.toggleTask);

// Xóa task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
