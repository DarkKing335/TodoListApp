// Middleware kiểm tra đăng nhập
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  req.flash('error', 'Vui lòng đăng nhập');
  res.redirect('/login');
};

// Middleware kiểm tra quyền admin
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.role === 'admin') return next();
  req.flash('error', 'Bạn không có quyền truy cập trang này');
  res.redirect('/');
};
