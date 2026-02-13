const Task = require('../models/Task');
const User = require('../models/User');

// ==================== API ====================

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('createdBy', 'username fullName')
      .populate('assignedTo', 'username fullName')
      .populate('completedBy', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTasksByUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    const tasks = await Task.find({
      $or: [{ createdBy: user._id }, { assignedTo: user._id }]
    }).populate('createdBy', 'username fullName')
      .populate('assignedTo', 'username fullName')
      .populate('completedBy', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTasksToday = async (req, res) => {
  try {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);
    const tasks = await Task.find({ createdAt: { $gte: start, $lte: end } })
      .populate('createdBy', 'username fullName')
      .populate('assignedTo', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getIncompleteTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ isDone: false })
      .populate('createdBy', 'username fullName')
      .populate('assignedTo', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTasksByNguyen = async (req, res) => {
  try {
    const users = await User.find({ fullName: { $regex: /^nguyễn/i } });
    if (users.length === 0) return res.json({ success: true, count: 0, data: [] });
    const userIds = users.map(u => u._id);
    const tasks = await Task.find({
      $or: [{ createdBy: { $in: userIds } }, { assignedTo: { $in: userIds } }]
    }).populate('createdBy', 'username fullName')
      .populate('assignedTo', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== WEB ====================

// Tạo task (normal user tự tạo cho mình)
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    await Task.create({
      title, description,
      createdBy: req.session.userId,
      assignedTo: [req.session.userId]
    });
    req.flash('success', 'Đã thêm task mới!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/');
  }
};

// Admin tạo và phân task
exports.createAndAssignTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    let assignees = [];
    if (assignedTo) {
      assignees = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    }
    await Task.create({
      title, description,
      createdBy: req.session.userId,
      assignedTo: assignees
    });
    req.flash('success', 'Đã tạo và phân công task!');
    res.redirect('/admin');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/admin');
  }
};

// Toggle done: user đánh dấu mình đã hoàn thành
exports.toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      req.flash('error', 'Không tìm thấy task');
      return res.redirect('/');
    }

    const userId = req.session.userId.toString();

    // Nếu task có assignedTo (multi-user)
    if (task.assignedTo.length > 0) {
      const alreadyCompleted = task.completedBy.some(id => id.toString() === userId);

      if (alreadyCompleted) {
        // Bỏ hoàn thành
        task.completedBy = task.completedBy.filter(id => id.toString() !== userId);
      } else {
        // Đánh dấu hoàn thành
        task.completedBy.push(req.session.userId);
      }

      // Kiểm tra tất cả đã hoàn thành chưa
      task.checkCompletion();
    } else {
      // Task không có assignedTo → toggle đơn giản
      task.isDone = !task.isDone;
      task.doneAt = task.isDone ? new Date() : null;
    }

    await task.save();
    res.redirect(req.headers.referer || '/');
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
    res.redirect(req.headers.referer || '/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/');
  }
};
