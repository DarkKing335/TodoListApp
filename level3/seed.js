const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Đã xóa dữ liệu cũ');

    // Tạo users với role
    const users = await User.create([
      { username: 'admin', password: '123456', fullName: 'Admin System', role: 'admin' },
      { username: 'nguyenvana', password: '123456', fullName: 'Nguyễn Văn A', role: 'normal' },
      { username: 'nguyenthib', password: '123456', fullName: 'Nguyễn Thị B', role: 'normal' },
      { username: 'tranvanc', password: '123456', fullName: 'Trần Văn C', role: 'normal' },
      { username: 'levand', password: '123456', fullName: 'Lê Văn D', role: 'normal' },
      { username: 'nguyenmine', password: '123456', fullName: 'Nguyễn Minh E', role: 'normal' }
    ]);
    console.log(`Đã tạo ${users.length} users`);

    const admin = users[0];
    const now = new Date();

    // Tạo tasks - một số do admin phân công cho nhiều người
    const tasks = await Task.create([
      // Task do admin tạo và phân cho 2 người
      {
        title: 'Hoàn thành báo cáo dự án',
        description: 'Viết báo cáo cuối kỳ',
        createdBy: admin._id,
        assignedTo: [users[1]._id, users[2]._id],
        completedBy: [users[1]._id], // Chỉ 1 người đã hoàn thành
        createdAt: now
      },
      // Task phân cho 3 người
      {
        title: 'Làm slide thuyết trình',
        description: 'PowerPoint cho buổi demo',
        createdBy: admin._id,
        assignedTo: [users[1]._id, users[3]._id, users[4]._id],
        createdAt: now
      },
      // Task phân cho 1 người
      {
        title: 'Review source code Sprint 3',
        description: 'Check quality và best practices',
        createdBy: admin._id,
        assignedTo: [users[2]._id],
        createdAt: now
      },
      // Task cá nhân tự tạo
      {
        title: 'Học JavaScript ES6',
        description: 'Arrow functions, Promises, Async/Await',
        createdBy: users[1]._id,
        assignedTo: [users[1]._id],
        createdAt: now
      },
      {
        title: 'Đọc sách Node.js',
        description: 'Chapter 5-6',
        createdBy: users[2]._id,
        assignedTo: [users[2]._id],
        isDone: true,
        doneAt: now,
        completedBy: [users[2]._id],
        createdAt: now
      },
      {
        title: 'Fix bug database',
        description: 'Connection pooling issue',
        createdBy: users[3]._id,
        assignedTo: [users[3]._id],
        createdAt: now
      },
      // Task phân cho tất cả - đã hoàn thành hết
      {
        title: 'Setup môi trường development',
        description: 'Node.js, MongoDB, VS Code',
        createdBy: admin._id,
        assignedTo: [users[1]._id, users[2]._id, users[3]._id],
        completedBy: [users[1]._id, users[2]._id, users[3]._id],
        isDone: true,
        doneAt: now,
        createdAt: now
      }
    ]);
    console.log(`Đã tạo ${tasks.length} tasks`);

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║     THÔNG TIN ĐĂNG NHẬP - LEVEL 3       ║');
    console.log('╠══════════════════════════════════════════╣');
    users.forEach(u => {
      const roleTag = u.role === 'admin' ? '[ADMIN]' : '[NORMAL]';
      console.log(`║  ${roleTag.padEnd(9)} ${u.username.padEnd(15)} | 123456  ║`);
    });
    console.log('╚══════════════════════════════════════════╝');
    console.log('\n✅ Seed dữ liệu Level 3 thành công!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi seed:', error.message);
    process.exit(1);
  }
};

seedData();
