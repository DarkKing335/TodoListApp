# Todo List Application - Bài Tập Lớn

**Sinh viên:** Nguyễn Anh Bằng - 23CNTT3  
**Môn học:** Phát triển ứng dụng Web  
**Hạn nộp:** 22/02/2026 5:59 AM

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Level 1: REST API](#level-1-rest-api)
- [Level 2: Web Interface với EJS](#level-2-web-interface-với-ejs)
- [Level 3: Phân quyền và Phân công Task](#level-3-phân-quyền-và-phân-công-task)
- [Cài đặt và Chạy](#cài-đặt-và-chạy)
- [Tính năng chính](#tính-năng-chính)
- [API Documentation](#api-documentation)

## 🎯 Giới thiệu

Ứng dụng Todo List được phát triển với 3 cấp độ chức năng:

1. **Level 1**: REST API cơ bản với các endpoint CRUD
2. **Level 2**: Giao diện web với EJS, session, progress bar
3. **Level 3**: Hệ thống phân quyền (Admin/Normal) và phân công task cho nhiều người

## 🛠️ Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Database**: MongoDB với Mongoose ODM
- **View Engine**: EJS (Level 2 & 3)
- **Authentication**: Session-based với bcryptjs
- **Frontend**: Bootstrap 5, Font Awesome
- **Security**: Password hashing (bcryptjs)

## 📁 Cấu trúc dự án

```
todo-app/
├── level1/              # REST API thuần túy
│   ├── config/          # Cấu hình database
│   ├── controllers/     # Task & User controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── seed.js          # Dữ liệu mẫu
│   └── server.js        # Entry point
│
├── level2/              # Web app với EJS
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── public/          # CSS, client JS
│   ├── routes/          # API + View routes
│   ├── views/           # EJS templates
│   ├── seed.js
│   └── server.js
│
└── level3/              # Phân quyền & phân công
    ├── config/
    ├── controllers/
    ├── middleware/      # Auth middleware
    ├── models/          # Models với role & assignment
    ├── public/
    ├── routes/
    ├── views/
    ├── seed.js
    └── server.js
```

---

## 🔷 Level 1: REST API

### Yêu cầu hoàn thành ✅

- [x] Collection User với password băm (bcryptjs)
- [x] Collection Task với trạng thái done và thời gian hoàn thành
- [x] Username unique, 1 user có nhiều task
- [x] API: Lấy tất cả tasks
- [x] API: Lấy task theo username
- [x] API: Xuất tasks trong ngày hiện tại
- [x] API: Xuất tasks chưa hoàn thành
- [x] API: Xuất tasks của users có họ "Nguyễn"

### Cài đặt

```bash
cd level1
npm install
```

### Cấu hình

Tạo file `.env` (hoặc sử dụng MongoDB mặc định):

```env
MONGO_URI=mongodb://localhost:27017/todo_app
PORT=3000
```

### Chạy ứng dụng

```bash
# Seed dữ liệu mẫu
npm run seed

# Khởi động server
npm start
```

Server chạy tại: **http://localhost:3000**

### API Endpoints

#### User Endpoints

| Method | Endpoint              | Mô tả            | Body                               |
| ------ | --------------------- | ---------------- | ---------------------------------- |
| POST   | `/api/users/register` | Đăng ký user mới | `{ username, password, fullName }` |
| POST   | `/api/users/login`    | Đăng nhập        | `{ username, password }`           |
| GET    | `/api/users`          | Lấy tất cả users | -                                  |

#### Task Endpoints (Yêu cầu bài tập)

| Method | Endpoint                       | Mô tả                             | Body/Params                      |
| ------ | ------------------------------ | --------------------------------- | -------------------------------- |
| GET    | `/api/tasks`                   | **Lấy tất cả tasks**              | -                                |
| GET    | `/api/tasks/by-user/:username` | **Lấy tasks theo username**       | `username` (param)               |
| GET    | `/api/tasks/today`             | **Lấy tasks trong ngày**          | -                                |
| GET    | `/api/tasks/incomplete`        | **Lấy tasks chưa hoàn thành**     | -                                |
| GET    | `/api/tasks/nguyen`            | **Lấy tasks của users họ Nguyễn** | -                                |
| POST   | `/api/tasks`                   | Tạo task mới                      | `{ title, description, userId }` |
| PUT    | `/api/tasks/:id/toggle`        | Toggle trạng thái done            | `id` (param)                     |
| DELETE | `/api/tasks/:id`               | Xóa task                          | `id` (param)                     |

### Ví dụ Request (Postman/Curl)

#### 1. Đăng ký user

```bash
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "username": "nguyenvana",
  "password": "123456",
  "fullName": "Nguyễn Văn A"
}
```

#### 2. Tạo task

```bash
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
  "title": "Học Node.js",
  "description": "Làm bài tập về MongoDB",
  "userId": "USER_ID_FROM_REGISTER"
}
```

#### 3. Lấy tasks của user "nguyenvana"

```bash
GET http://localhost:3000/api/tasks/by-user/nguyenvana
```

#### 4. Lấy tasks trong ngày

```bash
GET http://localhost:3000/api/tasks/today
```

#### 5. Lấy tasks chưa hoàn thành

```bash
GET http://localhost:3000/api/tasks/incomplete
```

#### 6. Lấy tasks của users họ Nguyễn

```bash
GET http://localhost:3000/api/tasks/nguyen
```

### Database Schema

#### User Model

```javascript
{
  username: String (unique, lowercase),
  password: String (hashed with bcrypt),
  fullName: String,
  timestamps: true
}
```

#### Task Model

```javascript
{
  title: String (required),
  description: String,
  isDone: Boolean (default: false),
  doneAt: Date (null when not done),
  createdBy: ObjectId (ref: 'User'),
  timestamps: true
}
```

---

## 🔷 Level 2: Web Interface với EJS

### Yêu cầu hoàn thành ✅

- [x] Giao diện đăng nhập/đăng ký
- [x] Trang chính với input nhập task và nút thêm
- [x] Danh sách (ul) hiển thị các task
- [x] Nút xóa cho mỗi task
- [x] **Progress bar** hiển thị % hoàn thành (Bootstrap)
- [x] Session management
- [x] Flash messages

### Cài đặt

```bash
cd level2
npm install
```

### Chạy ứng dụng

```bash
# Seed dữ liệu mẫu
npm run seed

# Khởi động server
npm start
```

Server chạy tại: **http://localhost:3000**

### Tính năng chính

1. **Đăng nhập/Đăng ký**
   - Form đăng ký với validation
   - Đăng nhập với session
   - Password được băm

2. **Dashboard cá nhân**
   - Thống kê: Tổng task, Hoàn thành, Chưa hoàn thành
   - **Progress bar động** với màu sắc theo tỷ lệ:
     - 0-49%: Vàng (warning)
     - 50-99%: Xanh dương (info)
     - 100%: Xanh lá (success)
   - Form thêm task mới
   - Danh sách task với:
     - Checkbox đánh dấu hoàn thành
     - Nút xóa
     - Thời gian tạo & hoàn thành

3. **Responsive design**
   - Bootstrap 5
   - Gradient cards
   - Font Awesome icons

### Views Structure

```
views/
├── index.ejs          # Trang chính (dashboard)
├── login.ejs          # Trang đăng nhập
├── register.ejs       # Trang đăng ký
└── partials/
    ├── header.ejs     # HTML head với Bootstrap
    └── footer.ejs     # Footer
```

### Routes

| Method | Route               | Mô tả                 |
| ------ | ------------------- | --------------------- |
| GET    | `/`                 | Dashboard (cần login) |
| GET    | `/login`            | Trang đăng nhập       |
| POST   | `/login`            | Xử lý đăng nhập       |
| GET    | `/register`         | Trang đăng ký         |
| POST   | `/register`         | Xử lý đăng ký         |
| GET    | `/logout`           | Đăng xuất             |
| POST   | `/tasks`            | Thêm task mới         |
| POST   | `/tasks/:id/toggle` | Toggle done/undone    |
| POST   | `/tasks/:id/delete` | Xóa task              |

### Screenshot Workflow (Level 2)

1. **Đăng ký account** → Screenshot form đăng ký
2. **Đăng nhập** → Screenshot form login
3. **Dashboard** → Screenshot với:
   - Cards thống kê
   - Progress bar
   - Form thêm task
   - Danh sách task
4. **Thêm task** → Screenshot sau khi thêm
5. **Đánh dấu hoàn thành** → Screenshot progress bar thay đổi
6. **Xóa task** → Screenshot sau khi xóa

---

## 🔷 Level 3: Phân quyền và Phân công Task

### Yêu cầu hoàn thành ✅

- [x] Hệ thống role: Admin và Normal
- [x] Admin có thể phân công task cho user khác
- [x] 1 task có thể có nhiều người (assignedTo)
- [x] Task chỉ hoàn thành khi **TẤT CẢ** người được phân công đều đánh dấu done
- [x] Trang Admin riêng
- [x] Middleware xác thực role

### Cài đặt

```bash
cd level3
npm install
```

### Chạy ứng dụng

```bash
# Seed dữ liệu mẫu (bao gồm admin & normal users)
npm run seed

# Khởi động server
npm start
```

Server chạy tại: **http://localhost:3000**

### Accounts mặc định sau seed

| Username   | Password | Role      | Full Name    |
| ---------- | -------- | --------- | ------------ |
| admin      | 123456   | **admin** | Admin User   |
| nguyenvana | 123456   | normal    | Nguyễn Văn A |
| nguyenthib | 123456   | normal    | Nguyễn Thị B |
| tranvanc   | 123456   | normal    | Trần Văn C   |

### Tính năng mới so với Level 2

#### 1. Role-based Access

- **Admin users**:
  - Truy cập trang `/admin`
  - Tạo task và phân công cho nhiều người
  - Xem tất cả tasks của hệ thống

- **Normal users**:
  - Chỉ xem tasks được phân công cho mình
  - Đánh dấu hoàn thành task của mình
  - Không thể phân công task

#### 2. Task Assignment Logic

**Ví dụ:**

- Admin tạo task "Làm project" và phân cho: User A, User B, User C
- User A đánh dấu hoàn thành → Task vẫn chưa xong
- User B đánh dấu hoàn thành → Task vẫn chưa xong
- User C đánh dấu hoàn thành → **Task mới hoàn thành** ✅

**Công thức:**

```
Task.isDone = (completedBy.length === assignedTo.length)
```

#### 3. Task States

Mỗi task hiển thị:

- **Assigned to**: Danh sách người được phân
- **Completed by**: Danh sách người đã hoàn thành
- **Status**: Pending / Completed
- **Progress**: X/Y người đã hoàn thành

### Database Schema (Level 3)

#### User Model

```javascript
{
  username: String,
  password: String (hashed),
  fullName: String,
  role: String (enum: ['admin', 'normal'], default: 'normal'),
  timestamps: true
}
```

#### Task Model

```javascript
{
  title: String,
  description: String,
  isDone: Boolean (auto-calculated),
  doneAt: Date,
  createdBy: ObjectId (ref: 'User'),
  assignedTo: [ObjectId] (ref: 'User'),      // Danh sách người được phân
  completedBy: [ObjectId] (ref: 'User'),     // Danh sách người đã done
  timestamps: true
}
```

### Routes (Level 3)

| Method | Route                   | Mô tả                  | Role  |
| ------ | ----------------------- | ---------------------- | ----- |
| GET    | `/admin`                | Trang admin            | Admin |
| POST   | `/tasks/assign`         | Tạo & phân công task   | Admin |
| POST   | `/tasks/:id/complete`   | Đánh dấu hoàn thành    | All   |
| POST   | `/tasks/:id/uncomplete` | Bỏ đánh dấu hoàn thành | All   |

### Middleware

```javascript
// middleware/auth.js
- requireLogin: Kiểm tra đã login
- requireAdmin: Kiểm tra role admin
```

### Screenshot Workflow (Level 3)

1. **Login as Admin** → Screenshot admin dashboard
2. **Admin page** → Screenshot form phân công task
3. **Tạo task cho nhiều người** → Screenshot danh sách assignee
4. **Login as Normal User** → Screenshot dashboard normal
5. **Đánh dấu task** → Screenshot task progress (X/Y completed)
6. **All users complete** → Screenshot task done ✅

---

## 🚀 Cài đặt và Chạy (Tổng hợp)

### Yêu cầu hệ thống

- Node.js >= 14.x
- MongoDB >= 4.x
- npm hoặc yarn

### Cài đặt MongoDB

**Windows:**

1. Tải MongoDB Community Server
2. Cài đặt và chạy MongoDB Compass (GUI)
3. Kết nối: `mongodb://localhost:27017`

**Hoặc sử dụng MongoDB Atlas (Cloud):**

1. Tạo cluster miễn phí tại [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Lấy connection string
3. Cập nhật trong `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todo_app
   ```

### Các bước chung cho cả 3 levels

```bash
# 1. Di chuyển vào thư mục level muốn chạy
cd level1  # hoặc level2, level3

# 2. Cài đặt dependencies
npm install

# 3. (Tùy chọn) Tạo file .env nếu cần
# echo "MONGO_URI=mongodb://localhost:27017/todo_app" > .env

# 4. Seed dữ liệu mẫu
npm run seed

# 5. Khởi động server
npm start
```

### Test dữ liệu mẫu

#### Level 1

Sau khi chạy `npm run seed`, bạn sẽ có:

- **5 users** với password `123456`
- **9 tasks** với các trạng thái khác nhau
- Users có họ "Nguyễn" để test API

#### Level 2

Sau khi chạy `npm run seed`, bạn sẽ có:

- **5 users** với password `123456`
- **9 tasks** để test giao diện web
- **Test accounts:**
  - Username: `nguyenvana` | Password: `123456`
  - Username: `nguyenthib` | Password: `123456`
  - Username: `tranvanc` | Password: `123456`
  - Username: `levand` | Password: `123456`
  - Username: `nguyenmine` | Password: `123456`

#### Level 3

Sau khi chạy `npm run seed`, bạn sẽ có:

- **6 users** (1 admin + 5 normal) với password `123456`
- **7 tasks** với assignment tracking
- **Test accounts:**
  - **Admin**: `admin` / `123456` ✅
  - **Normal**: `nguyenvana` / `123456`
  - **Normal**: `nguyenthib` / `123456`
  - **Normal**: `tranvanc` / `123456`
  - **Normal**: `levand` / `123456`
  - **Normal**: `nguyenmine` / `123456`

---

## ✨ Tính năng chính

### Level 1: API Features

- ✅ User registration với password hashing
- ✅ CRUD operations cho tasks
- ✅ Populate user info khi query tasks
- ✅ Filter theo username, date, completion status
- ✅ Regex search cho họ "Nguyễn"

### Level 2: Web Features

- ✅ Authentication với session
- ✅ Flash messages
- ✅ Responsive UI với Bootstrap 5
- ✅ **Dynamic progress bar** với màu sắc
- ✅ Real-time task statistics
- ✅ Inline task toggle/delete
- ✅ Beautiful gradient cards

### Level 3: Advanced Features

- ✅ Role-based access control (RBAC)
- ✅ Task assignment system
- ✅ Multi-user collaboration
- ✅ Completion tracking
- ✅ Admin dashboard
- ✅ Protected routes với middleware

---

## 📊 API Documentation Chi tiết

### Response Format

**Success:**

```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error message"
}
```

### Authentication

Level 1 không yêu cầu authentication cho API.  
Level 2 & 3 sử dụng session-based auth (cookie).

### Error Codes

| Code | Meaning                          |
| ---- | -------------------------------- |
| 400  | Bad Request - Missing parameters |
| 404  | Not Found - Resource not found   |
| 500  | Server Error - Internal error    |

---

## 📝 Ghi chú quan trọng

### Level 1

- API chỉ trả về JSON
- Password luôn được băm trước khi lưu
- Username tự động chuyển thành lowercase
- Task `isDone` tự động set khi toggle

### Level 2

- Session timeout: 24 giờ
- Phải login mới truy cập dashboard
- Progress bar cập nhật real-time khi toggle task
- Form validation phía client & server

### Level 3

- Admin được tạo qua seed hoặc manual trong DB
- Task chỉ done khi **tất cả** assignee complete
- Normal user chỉ thấy task được assign
- Middleware bảo vệ routes `/admin`

---

## 🎥 Recording GIF Demo

Sử dụng công cụ:

- **ScreenToGif** (Windows) - Recommended
- **LICEcap** (Cross-platform)
- **Peek** (Linux)

### Nội dung cần quay

**Level 2 GIF:**

1. Login → Dashboard
2. Thêm task mới
3. Check/uncheck task → Progress bar thay đổi
4. Xóa task
5. Logout

**Level 3 GIF:**

1. Login as Admin
2. Vào trang /admin
3. Tạo task phân cho nhiều người
4. Logout → Login as Normal User
5. User 1 đánh dấu hoàn thành → Chưa xong
6. Logout → Login as User 2
7. User 2 đánh dấu hoàn thành → Task done ✅

---

## ✅ Trạng thái Project

### Đã hoàn thành và test thành công:

#### ✅ Level 1 - REST API

- Server chạy thành công tại http://localhost:3000
- MongoDB kết nối thành công
- 5 API endpoints bắt buộc hoạt động tốt
- Password hashing với bcryptjs
- Seed data: 5 users, 9 tasks

#### ✅ Level 2 - Web Interface

- Dependencies đã cài đặt
- Server chạy thành công
- Giao diện EJS với Bootstrap 5
- **Progress bar** động với 3 màu (vàng/xanh dương/xanh lá)
- Session authentication hoạt động
- Flash messages
- Seed data: 5 users, 9 tasks

#### ✅ Level 3 - Admin & Assignment

- Dependencies đã cài đặt
- Server chạy thành công
- Role system: Admin & Normal
- Task assignment cho nhiều users
- Multi-user completion logic
- Middleware protection
- Seed data: 6 users (1 admin + 5 normal), 7 tasks

---

## 📦 Nộp bài

### Checklist

- [ ] Link GitHub repository (public)
- [ ] File tài liệu với:
  - [ ] Luồng hoạt động từng level
  - [ ] Screenshots kết quả API (Level 1)
  - [ ] Screenshots giao diện (Level 2 & 3)
- [ ] File GIF demo cho Level 2 (45-60s)
- [ ] File GIF demo cho Level 3 (75-90s)
- [ ] README.md này

### Nội dung GIF Demo

**Level 2 GIF (45-60s):**

1. Login → Dashboard
2. Thêm task mới
3. Toggle task → Progress bar thay đổi màu
4. Xóa task
5. Logout

**Level 3 GIF (75-90s):**

1. Login Admin → Tạo task cho 3 users
2. Logout → Login User 1 → Complete (1/3)
3. Logout → Login User 2 → Complete (2/3)
4. Logout → Login User 3 → Complete (3/3) → Task done ✅

### Cấu trúc nộp

```
Submission/
├── README.md
├── Link_GitHub.txt
├── Screenshots/
│   ├── level1_api_*.png
│   ├── level2_*.png
│   └── level3_*.png
├── Level2_Demo.gif
└── Level3_Demo.gif
```

---

## 🐛 Troubleshooting

### MongoDB connection failed

```bash
# Kiểm tra MongoDB đang chạy
# Windows: Services → MongoDB Server
# Mac/Linux: sudo systemctl status mongod

# Hoặc kết nối MongoDB Compass:
mongodb://localhost:27017
```

### Port already in use

```bash
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Kill process (thay <PID> bằng số từ lệnh trên)
taskkill /PID <PID> /F

# Hoặc thay đổi PORT trong server.js
const PORT = 3001;
```

### Seed data error

```bash
# Xóa database và seed lại
# MongoDB Compass: Drop database 'todo_app'
npm run seed

# Hoặc dùng mongosh:
mongosh
use todo_app
db.dropDatabase()
exit
```

### Node.js process không dừng

```bash
# Windows PowerShell:
Get-Process node | Stop-Process -Force

# Command Prompt:
taskkill /IM node.exe /F
```

---

## 👨‍💻 Tác giả

**Nguyễn Anh Bằng**  
Lớp: 23CNTT3  
Email: [your-email@example.com]

---

## 📄 License

Bài tập môn học - Sử dụng cho mục đích học tập.

---

## 🙏 Tài liệu tham khảo

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [EJS Documentation](https://ejs.co/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/)
- [MongoDB Manual](https://docs.mongodb.com/)

---

**Chúc bạn hoàn thành tốt bài tập! 🎉**
