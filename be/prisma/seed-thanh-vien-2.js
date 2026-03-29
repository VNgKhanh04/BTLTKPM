// Seed data cho Thành viên 2: Sinh viên
// Chạy: node prisma/seed-thanh-vien-2.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu cho Thành viên 2...');

  // Lấy khoa CNTT
  const khoa = await prisma.khoa.findUnique({
    where: { ma_khoa: 'CNTT' }
  });

  if (!khoa) {
    console.error('❌ Không tìm thấy khoa CNTT. Vui lòng chạy seed-thanh-vien-1.js trước');
    return;
  }

  // Tạo sinh viên
  const sinhViens = [
    {
      ma_sinh_vien: 'SV001',
      ho_ten: 'Nguyễn Văn An',
      ngay_sinh: new Date('2002-01-15'),
      gioi_tinh: 1,
      email: 'nguyenvanan@student.edu.vn',
      so_dien_thoai: '0901234001',
      khoa_id: khoa.khoa_id,
      lop: 'CNTT-K18',
      khoa_hoc: '2020-2024',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV002',
      ho_ten: 'Trần Thị Bình',
      ngay_sinh: new Date('2002-03-20'),
      gioi_tinh: 0,
      email: 'tranthibinh@student.edu.vn',
      so_dien_thoai: '0901234002',
      khoa_id: khoa.khoa_id,
      lop: 'CNTT-K18',
      khoa_hoc: '2020-2024',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV003',
      ho_ten: 'Lê Văn Cường',
      ngay_sinh: new Date('2002-05-10'),
      gioi_tinh: 1,
      email: 'levancuong@student.edu.vn',
      so_dien_thoai: '0901234003',
      khoa_id: khoa.khoa_id,
      lop: 'CNTT-K18',
      khoa_hoc: '2020-2024',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV004',
      ho_ten: 'Phạm Thị Dung',
      ngay_sinh: new Date('2002-07-25'),
      gioi_tinh: 0,
      email: 'phamthidung@student.edu.vn',
      so_dien_thoai: '0901234004',
      khoa_id: khoa.khoa_id,
      lop: 'CNTT-K18',
      khoa_hoc: '2020-2024',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV005',
      ho_ten: 'Hoàng Văn Em',
      ngay_sinh: new Date('2002-09-30'),
      gioi_tinh: 1,
      email: 'hoangvanem@student.edu.vn',
      so_dien_thoai: '0901234005',
      khoa_id: khoa.khoa_id,
      lop: 'CNTT-K18',
      khoa_hoc: '2020-2024',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV006',
      ho_ten: 'Đỗ Thị Phương',
      ngay_sinh: new Date('2002-11-12'),
      gioi_tinh: 0,
      email: 'dothiphuong@student.edu.vn',
      so_dien_thoai: '0901234006',
      khoa_id: khoa.khoa_id,
      lop: 'CNTT-K18',
      khoa_hoc: '2020-2024',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV007',
      ho_ten: 'Vũ Văn Giang',
      ngay_sinh: new Date('2002-02-18'),
      gioi_tinh: 1,
      email: 'vuvangiang@student.edu.vn',
      so_dien_thoai: '0901234007',
      khoa_id: khoa.khoa_id,
      lop: 'CNTT-K18',
      khoa_hoc: '2020-2024',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV008',
      ho_ten: 'Bùi Thị Hà',
      ngay_sinh: new Date('2002-04-22'),
      gioi_tinh: 0,
      email: 'buithiha@student.edu.vn',
      so_dien_thoai: '0901234008',
      khoa_id: khoa.khoa_id,
      lop: 'CNTT-K18',
      khoa_hoc: '2020-2024',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV009',
      ho_ten: 'Đinh Văn Ích',
      ngay_sinh: new Date('2002-06-08'),
      gioi_tinh: 1,
      email: 'dinhvanich@student.edu.vn',
      so_dien_thoai: '0901234009',
      khoa_id: khoa.khoa_id,
      lop: 'CNTT-K18',
      khoa_hoc: '2020-2024',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV010',
      ho_ten: 'Ngô Thị Kim',
      ngay_sinh: new Date('2002-08-14'),
      gioi_tinh: 0,
      email: 'ngothikim@student.edu.vn',
      so_dien_thoai: '0901234010',
      khoa_id: khoa.khoa_id,
      lop: 'CNTT-K18',
      khoa_hoc: '2020-2024',
      trang_thai: 1,
    },
  ];

  for (const sv of sinhViens) {
    await prisma.sinhVien.upsert({
      where: { ma_sinh_vien: sv.ma_sinh_vien },
      update: {},
      create: sv,
    });
  }
  console.log('✓ Đã tạo', sinhViens.length, 'sinh viên');

  console.log('✅ Hoàn thành seed dữ liệu cho Thành viên 2!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
