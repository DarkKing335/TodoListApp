const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    await connectDB();

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Đã xóa dữ liệu cũ');

    // Tạo users
    const users = await User.create([
      { username: 'nguyenvana', password: '123456', fullName: 'Nguyễn Văn A' },
      { username: 'nguyenthib', password: '123456', fullName: 'Nguyễn Thị B' },
      { username: 'tranvanc', password: '123456', fullName: 'Trần Văn C' },
      { username: 'levand', password: '123456', fullName: 'Lê Văn D' },
      { username: 'nguyenmine', password: '123456', fullName: 'Nguyễn Minh E' }
    ]);
    console.log(`Đã tạo ${users.length} users`);

    // Tạo tasks
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const tasks = await Task.create([
      { title: 'Học JavaScript', description: 'Học ES6+ features', createdBy: users[0]._id, createdAt: now },
      { title: 'Làm bài tập MongoDB', description: 'CRUD operations', createdBy: users[0]._id, createdAt: now },
      { title: 'Đọc sách Node.js', description: 'Chapter 5-6', createdBy: users[1]._id, createdAt: now },
      { title: 'Thiết kế database', description: 'ERD diagram', createdBy: users[1]._id, isDone: true, doneAt: now, createdAt: now },
      { title: 'Viết báo cáo', description: 'Báo cáo tuần', createdBy: users[2]._id, createdAt: yesterday },
      { title: 'Review code', description: 'Pull request #42', createdBy: users[2]._id, isDone: true, doneAt: yesterday, createdAt: yesterday },
      { title: 'Học React', description: 'Component lifecycle', createdBy: users[3]._id, createdAt: now },
      { title: 'Chuẩn bị presentation', description: 'Slide tuần sau', createdBy: users[4]._id, createdAt: now },
      { title: 'Fix bug login', description: 'Session timeout', createdBy: users[4]._id, isDone: true, doneAt: now, createdAt: now }
    ]);
    console.log(`Đã tạo ${tasks.length} tasks`);

    console.log('\n--- Thông tin seed ---');
    console.log('Users:');
    users.forEach(u => console.log(`  - ${u.username} (${u.fullName}) | password: 123456`));
    console.log('\nTasks:');
    tasks.forEach(t => console.log(`  - "${t.title}" | Done: ${t.isDone}`));

    console.log('\n✅ Seed dữ liệu thành công!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi seed:', error.message);
    process.exit(1);
  }
};

seedData();
