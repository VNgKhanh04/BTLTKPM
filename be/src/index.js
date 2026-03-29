const express = require('express');
const cors = require('cors');
require('dotenv').config();
const prisma = require('./config/prisma');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - Theo phân công 5 thành viên

// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm
app.use('/api/topics', require('./routes/deTai'));
app.use('/api/fields', require('./routes/linhVuc'));

// Thành viên 2: Màn hình tạo nhóm đăng ký đề tài
app.use('/api/research-groups', require('./routes/nhomNghienCuu'));
app.use('/api/students', require('./routes/sinhvien'));

// Thành viên 3: Màn hình chọn giảng viên hướng dẫn
app.use('/api/lecturers', require('./routes/giangVien'));

// Thành viên 4: Màn hình nộp hồ sơ đăng ký đề tài
app.use('/api/topic-registrations', require('./routes/hoSoDangKy'));

// Thành viên 5: Kiểm tra điều kiện đăng ký, thông báo và xử lý lỗi
app.use('/api/notifications', require('./routes/thongBao'));
app.use('/api/validation', require('./routes/validation'));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected', 
      error: error.message 
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'API Hệ thống Quản lý Nghiên cứu Khoa học',
    version: '1.0.0',
    endpoints: {
      topics: '/api/topics',
      fields: '/api/fields',
      researchGroups: '/api/research-groups',
      students: '/api/students',
      lecturers: '/api/lecturers',
      topicRegistrations: '/api/topic-registrations',
      notifications: '/api/notifications',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Không tìm thấy endpoint',
    path: req.path,
    method: req.method
  });
});

// Error handler middleware (phải đặt cuối cùng)
app.use(errorHandler);

// Kết nối PostgreSQL với Prisma
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Đã kết nối PostgreSQL (Supabase) thành công');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Lỗi kết nối PostgreSQL:', err);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Đã ngắt kết nối database');
  process.exit(0);
});

