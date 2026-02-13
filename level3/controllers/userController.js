const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, password, fullName } = req.body;
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      req.flash('error', 'Username đã tồn tại');
      return res.redirect('/register');
    }
    // Mặc định role là 'normal'
    const user = await User.create({ username, password, fullName, role: 'normal' });
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.fullName = user.fullName;
    req.session.role = user.role;
    req.flash('success', 'Đăng ký thành công!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      req.flash('error', 'Username không tồn tại');
      return res.redirect('/login');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Sai password');
      return res.redirect('/login');
    }
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.fullName = user.fullName;
    req.session.role = user.role;
    req.flash('success', 'Đăng nhập thành công!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
