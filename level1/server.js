const express = require('express');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Route mặc định
app.get('/', (req, res) => {
  res.json({
    message: 'Todo List API - Level 1',
    endpoints: {
      users: {
        'POST /api/users/register': 'Đăng ký user mới',
        'POST /api/users/login': 'Đăng nhập',
        'GET /api/users': 'Lấy tất cả users'
      },
      tasks: {
        'GET /api/tasks': 'Lấy tất cả tasks',
        'GET /api/tasks/by-user/:username': 'Lấy tasks theo username',
        'GET /api/tasks/today': 'Lấy tasks trong ngày',
        'GET /api/tasks/incomplete': 'Lấy tasks chưa hoàn thành',
        'GET /api/tasks/nguyen': 'Lấy tasks của user họ Nguyễn',
        'POST /api/tasks': 'Tạo task mới (body: title, description, userId)',
        'PUT /api/tasks/:id/toggle': 'Đánh dấu hoàn thành/chưa',
        'DELETE /api/tasks/:id': 'Xóa task'
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
