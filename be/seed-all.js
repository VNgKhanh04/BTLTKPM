// Seed tất cả dữ liệu cho hệ thống
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
  console.log('🌱 Bắt đầu seed toàn bộ dữ liệu...\n');

  // 1. Tạo các khoa
  console.log('📚 Tạo các khoa...');
  const khoaCNTT = await prisma.khoa.upsert({
    where: { ma_khoa: 'CNTT' },
    update: {},
    create: {
      ma_khoa: 'CNTT',
      ten_khoa: 'Công nghệ Thông tin',
      email_lien_he: 'cntt@university.edu.vn',
      so_dien_thoai: '0241234567',
      trang_thai: 1,
    },
  });

  const khoaKT = await prisma.khoa.upsert({
    where: { ma_khoa: 'KT' },
    update: {},
    create: {
      ma_khoa: 'KT',
      ten_khoa: 'Kinh tế',
      email_lien_he: 'kt@university.edu.vn',
      so_dien_thoai: '0241234568',
      trang_thai: 1,
    },
  });

  const khoaNN = await prisma.khoa.upsert({
    where: { ma_khoa: 'NN' },
    update: {},
    create: {
      ma_khoa: 'NN',
      ten_khoa: 'Ngoại ngữ',
      email_lien_he: 'nn@university.edu.vn',
      so_dien_thoai: '0241234569',
      trang_thai: 1,
    },
  });

  console.log('✓ Đã tạo 3 khoa\n');

  // 2. Tạo lĩnh vực nghiên cứu
  console.log('🔬 Tạo lĩnh vực nghiên cứu...');
  const linhVucs = [
    {
      ma_linh_vuc: 'LV001',
      ten_linh_vuc: 'Trí tuệ nhân tạo',
      mo_ta: 'Nghiên cứu về AI, Machine Learning, Deep Learning',
      trang_thai: 1,
    },
    {
      ma_linh_vuc: 'LV002',
      ten_linh_vuc: 'Phát triển Web',
      mo_ta: 'Nghiên cứu về công nghệ web, framework, UX/UI',
      trang_thai: 1,
    },
    {
      ma_linh_vuc: 'LV003',
      ten_linh_vuc: 'An toàn thông tin',
      mo_ta: 'Nghiên cứu về bảo mật, mã hóa, phòng chống tấn công',
      trang_thai: 1,
    },
    {
      ma_linh_vuc: 'LV004',
      ten_linh_vuc: 'Khoa học dữ liệu',
      mo_ta: 'Nghiên cứu về phân tích dữ liệu, Big Data, Data Mining',
      trang_thai: 1,
    },
    {
      ma_linh_vuc: 'LV005',
      ten_linh_vuc: 'Internet of Things',
      mo_ta: 'Nghiên cứu về IoT, Smart Home, Embedded Systems',
      trang_thai: 1,
    },
  ];

  for (const lv of linhVucs) {
    await prisma.linhVucNghienCuu.upsert({
      where: { ma_linh_vuc: lv.ma_linh_vuc },
      update: {},
      create: lv,
    });
  }

  console.log('✓ Đã tạo 5 lĩnh vực\n');

  // 3. Tạo giảng viên
  console.log('👨‍🏫 Tạo giảng viên...');
  const giangViens = [
    {
      ma_giang_vien: 'GV001',
      ho_ten: 'TS. Nguyễn Văn An',
      email: 'nva@university.edu.vn',
      so_dien_thoai: '0901234567',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'Trí tuệ nhân tạo, Machine Learning',
      so_luong_huong_dan_toi_da: 5,
      trang_thai: 1,
    },
    {
      ma_giang_vien: 'GV002',
      ho_ten: 'PGS.TS. Trần Thị Bình',
      email: 'ttb@university.edu.vn',
      so_dien_thoai: '0901234568',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'Phát triển Web, Full-stack Development',
      so_luong_huong_dan_toi_da: 6,
      trang_thai: 1,
    },
    {
      ma_giang_vien: 'GV003',
      ho_ten: 'TS. Lê Văn Cường',
      email: 'lvc@university.edu.vn',
      so_dien_thoai: '0901234569',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'An toàn thông tin, Mã hóa',
      so_luong_huong_dan_toi_da: 4,
      trang_thai: 1,
    },
  ];

  for (const gv of giangViens) {
    await prisma.giangVien.upsert({
      where: { ma_giang_vien: gv.ma_giang_vien },
      update: {},
      create: gv,
    });
  }

  console.log('✓ Đã tạo 3 giảng viên\n');

  // 4. Lấy lĩnh vực và giảng viên để tạo đề tài
  const linhVucAI = await prisma.linhVucNghienCuu.findFirst({
    where: { ma_linh_vuc: 'LV001' },
  });
  const linhVucWeb = await prisma.linhVucNghienCuu.findFirst({
    where: { ma_linh_vuc: 'LV002' },
  });
  const linhVucSecurity = await prisma.linhVucNghienCuu.findFirst({
    where: { ma_linh_vuc: 'LV003' },
  });

  const gv1 = await prisma.giangVien.findFirst({
    where: { ma_giang_vien: 'GV001' },
  });
  const gv2 = await prisma.giangVien.findFirst({
    where: { ma_giang_vien: 'GV002' },
  });
  const gv3 = await prisma.giangVien.findFirst({
    where: { ma_giang_vien: 'GV003' },
  });

  // 5. Tạo đề tài
  console.log('📝 Tạo đề tài nghiên cứu...');
  const deTais = [
    {
      ma_de_tai: 'DT001',
      ten_de_tai: 'Ứng dụng AI trong nhận diện khuôn mặt',
      linh_vuc_id: linhVucAI.linh_vuc_id,
      mo_ta: 'Nghiên cứu và phát triển hệ thống nhận diện khuôn mặt sử dụng deep learning',
      muc_tieu: 'Xây dựng hệ thống nhận diện chính xác trên 95%',
      yeu_cau: 'Sinh viên cần có kiến thức về Python, TensorFlow',
      so_luong_thanh_vien_toi_da: 4,
      giang_vien_huong_dan_id: gv1.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: '2',
    },
    {
      ma_de_tai: 'DT002',
      ten_de_tai: 'Hệ thống quản lý thư viện trực tuyến',
      linh_vuc_id: linhVucWeb.linh_vuc_id,
      mo_ta: 'Xây dựng website quản lý thư viện với React và Node.js',
      muc_tieu: 'Tạo hệ thống quản lý hiệu quả, dễ sử dụng',
      yeu_cau: 'Sinh viên cần biết JavaScript, React, Node.js',
      so_luong_thanh_vien_toi_da: 3,
      giang_vien_huong_dan_id: gv2.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: '2',
    },
    {
      ma_de_tai: 'DT003',
      ten_de_tai: 'Nghiên cứu mã hóa dữ liệu blockchain',
      linh_vuc_id: linhVucSecurity.linh_vuc_id,
      mo_ta: 'Tìm hiểu và ứng dụng blockchain trong bảo mật dữ liệu',
      muc_tieu: 'Xây dựng mô hình bảo mật sử dụng blockchain',
      yeu_cau: 'Sinh viên cần có kiến thức về mật mã học',
      so_luong_thanh_vien_toi_da: 3,
      giang_vien_huong_dan_id: gv3.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: '2',
    },
  ];

  for (const dt of deTais) {
    await prisma.deTaiNghienCuu.upsert({
      where: { ma_de_tai: dt.ma_de_tai },
      update: {},
      create: dt,
    });
  }

  console.log('✓ Đã tạo 3 đề tài\n');

  // 6. Tạo sinh viên
  console.log('👨‍🎓 Tạo sinh viên...');
  const sinhViens = [
    {
      ma_sinh_vien: 'SV001',
      ho_ten: 'Nguyễn Văn A',
      email: 'nva.sv@university.edu.vn',
      khoa_id: khoaCNTT.khoa_id,
      lop: 'CNTT01',
      khoa_hoc: '2021-2025',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV002',
      ho_ten: 'Trần Thị B',
      email: 'ttb.sv@university.edu.vn',
      khoa_id: khoaCNTT.khoa_id,
      lop: 'CNTT01',
      khoa_hoc: '2021-2025',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV003',
      ho_ten: 'Lê Văn C',
      email: 'lvc.sv@university.edu.vn',
      khoa_id: khoaCNTT.khoa_id,
      lop: 'CNTT02',
      khoa_hoc: '2021-2025',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV004',
      ho_ten: 'Phạm Thị D',
      email: 'ptd.sv@university.edu.vn',
      khoa_id: khoaCNTT.khoa_id,
      lop: 'CNTT02',
      khoa_hoc: '2021-2025',
      trang_thai: 1,
    },
    {
      ma_sinh_vien: 'SV005',
      ho_ten: 'Hoàng Văn E',
      email: 'hve.sv@university.edu.vn',
      khoa_id: khoaCNTT.khoa_id,
      lop: 'CNTT03',
      khoa_hoc: '2021-2025',
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

  console.log('✓ Đã tạo 5 sinh viên\n');

  console.log('✅ Hoàn thành seed toàn bộ dữ liệu!');
  console.log('\n📊 Tổng kết:');
  console.log('- 3 Khoa');
  console.log('- 5 Lĩnh vực');
  console.log('- 3 Giảng viên');
  console.log('- 3 Đề tài');
  console.log('- 5 Sinh viên');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
