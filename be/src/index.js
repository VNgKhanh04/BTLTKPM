const express = require('express');
const cors = require('cors');
require('dotenv').config();
const prisma = require('./config/prisma');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

function getDatabaseHost() {
  try {
    return new URL(process.env.DATABASE_URL).hostname;
  } catch {
    return 'unknown-host';
  }
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/topics', require('./routes/deTai'));
app.use('/api/fields', require('./routes/linhVuc'));
app.use('/api/research-groups', require('./routes/nhomNghienCuu'));
app.use('/api/students', require('./routes/sinhvien'));
app.use('/api/lecturers', require('./routes/giangVien'));
app.use('/api/science-councils', require('./routes/hoiDong'));
app.use('/api/defense-schedules', require('./routes/lichBaoVe'));
app.use('/api/topic-registrations', require('./routes/hoSoDangKy'));
app.use('/api/notifications', require('./routes/thongBao'));
app.use('/api/validation', require('./routes/validation'));

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
    });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'API Hệ thống Quản lý Nghiên cứu Khoa học',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      topics: '/api/topics',
      fields: '/api/fields',
      researchGroups: '/api/research-groups',
      students: '/api/students',
      lecturers: '/api/lecturers',
      scienceCouncils: '/api/science-councils',
      defenseSchedules: '/api/defense-schedules',
      topicRegistrations: '/api/topic-registrations',
      notifications: '/api/notifications',
      health: '/health',
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Không tìm thấy endpoint',
    path: req.path,
    method: req.method,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('Đã kết nối cơ sở dữ liệu');

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại cổng ${PORT}`);
    });
  } catch (err) {
    const databaseHost = getDatabaseHost();
    const errorMessage = err instanceof Error ? err.message : '';
    const isDatabaseReachabilityError = err && (
      err.code === 'P1001' ||
      err.code === 'P2010' ||
      err.code === 'ENOTFOUND' ||
      err.errno === 'ENOTFOUND' ||
      errorMessage.includes("Can't reach database server")
    );

    if (isDatabaseReachabilityError) {
      console.error(`Không thể kết nối tới máy chủ cơ sở dữ liệu ${databaseHost}. Hãy kiểm tra DATABASE_URL trong be/.env.`);
    }

    console.error('Lỗi kết nối cơ sở dữ liệu:', err);
    process.exit(1);
  }
}

main();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Đã ngắt kết nối cơ sở dữ liệu');
  process.exit(0);
});
