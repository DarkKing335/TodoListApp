const User = require('../models/User');

// Đăng ký user mới
exports.register = async (req, res) => {
  try {
    const { username, password, fullName } = req.body;

    // Kiểm tra username đã tồn tại chưa
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username đã tồn tại' });
    }

    const user = await User.create({ username, password, fullName });
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: { id: user._id, username: user.username, fullName: user.fullName }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Username không tồn tại' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Sai password' });
    }

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: { id: user._id, username: user.username, fullName: user.fullName }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tất cả users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
