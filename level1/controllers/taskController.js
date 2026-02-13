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
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }
    const tasks = await Task.find({ createdBy: user._id }).populate('createdBy', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tasks trong ngày hiện tại
exports.getTasksToday = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate('createdBy', 'username fullName');

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tasks chưa hoàn thành
exports.getIncompleteTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ isDone: false }).populate('createdBy', 'username fullName');
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tasks của user có họ "Nguyễn"
exports.getTasksByNguyen = async (req, res) => {
  try {
    // Tìm users có họ Nguyễn (tên đầy đủ bắt đầu bằng "Nguyễn")
    const users = await User.find({
      fullName: { $regex: /^nguyễn/i }
    });

    if (users.length === 0) {
      return res.json({ success: true, count: 0, data: [], message: 'Không tìm thấy user nào có họ Nguyễn' });
    }

    const userIds = users.map(u => u._id);
    const tasks = await Task.find({ createdBy: { $in: userIds } }).populate('createdBy', 'username fullName');

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo task mới
exports.createTask = async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId là bắt buộc' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }

    const task = await Task.create({ title, description, createdBy: userId });
    const populatedTask = await Task.findById(task._id).populate('createdBy', 'username fullName');

    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Đánh dấu task hoàn thành / chưa hoàn thành
exports.toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy task' });
    }

    task.isDone = !task.isDone;
    task.doneAt = task.isDone ? new Date() : null;
    await task.save();

    const populatedTask = await Task.findById(task._id).populate('createdBy', 'username fullName');
    res.json({ success: true, data: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy task' });
    }
    res.json({ success: true, message: 'Đã xóa task' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
