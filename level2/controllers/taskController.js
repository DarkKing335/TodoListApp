const Task = require('../models/Task');
const User = require('../models/User');

// Lấy tất cả tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('createdBy', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tasks theo username
exports.getTasksByUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    const tasks = await Task.find({ createdBy: user._id }).populate('createdBy', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tasks trong ngày hiện tại
exports.getTasksToday = async (req, res) => {
  try {
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);
    const tasks = await Task.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }).populate('createdBy', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tasks chưa hoàn thành
exports.getIncompleteTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ isDone: false }).populate('createdBy', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tasks của user họ Nguyễn
exports.getTasksByNguyen = async (req, res) => {
  try {
    const users = await User.find({ fullName: { $regex: /^nguyễn/i } });
    if (users.length === 0) return res.json({ success: true, count: 0, data: [] });
    const userIds = users.map(u => u._id);
    const tasks = await Task.find({ createdBy: { $in: userIds } }).populate('createdBy', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo task (web form)
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    await Task.create({ title, description, createdBy: req.session.userId });
    req.flash('success', 'Đã thêm task mới!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/');
  }
};

// Toggle done
exports.toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      req.flash('error', 'Không tìm thấy task');
      return res.redirect('/');
    }
    task.isDone = !task.isDone;
    task.doneAt = task.isDone ? new Date() : null;
    await task.save();
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/');
  }
};

// Xóa task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    req.flash('success', 'Đã xóa task!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/');
  }
};
