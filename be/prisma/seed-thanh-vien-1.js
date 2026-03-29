// Seed data cho Thành viên 1: Đề tài và Lĩnh vực
// Chạy: node prisma/seed-thanh-vien-1.js

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
  console.log('🌱 Bắt đầu seed dữ liệu cho Thành viên 1...');

  // 1. Tạo Khoa
  const khoa = await prisma.khoa.upsert({
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
  console.log('✓ Đã tạo Khoa:', khoa.ten_khoa);

  // 2. Tạo Lĩnh vực nghiên cứu
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
      mo_ta: 'Nghiên cứu về công nghệ web, frontend, backend',
      trang_thai: 1,
    },
    {
      ma_linh_vuc: 'LV003',
      ten_linh_vuc: 'An toàn thông tin',
      mo_ta: 'Nghiên cứu về bảo mật, mã hóa, an ninh mạng',
      trang_thai: 1,
    },
    {
      ma_linh_vuc: 'LV004',
      ten_linh_vuc: 'Phát triển Mobile',
      mo_ta: 'Nghiên cứu về ứng dụng di động iOS, Android',
      trang_thai: 1,
    },
    {
      ma_linh_vuc: 'LV005',
      ten_linh_vuc: 'Khoa học dữ liệu',
      mo_ta: 'Nghiên cứu về phân tích dữ liệu, Big Data',
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
  console.log('✓ Đã tạo', linhVucs.length, 'lĩnh vực nghiên cứu');

  // 3. Tạo Giảng viên
  const giangViens = [
    {
      ma_giang_vien: 'GV001',
      ho_ten: 'TS. Nguyễn Văn A',
      email: 'nguyenvana@university.edu.vn',
      so_dien_thoai: '0912345001',
      khoa_id: khoa.khoa_id,
      chuyen_mon: 'Trí tuệ nhân tạo, Machine Learning',
      so_luong_huong_dan_toi_da: 5,
      trang_thai: 1,
    },
    {
      ma_giang_vien: 'GV002',
      ho_ten: 'TS. Trần Thị B',
      email: 'tranthib@university.edu.vn',
      so_dien_thoai: '0912345002',
      khoa_id: khoa.khoa_id,
      chuyen_mon: 'Phát triển Web, Cloud Computing',
      so_luong_huong_dan_toi_da: 5,
      trang_thai: 1,
    },
    {
      ma_giang_vien: 'GV003',
      ho_ten: 'ThS. Lê Văn C',
      email: 'levanc@university.edu.vn',
      so_dien_thoai: '0912345003',
      khoa_id: khoa.khoa_id,
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
  console.log('✓ Đã tạo', giangViens.length, 'giảng viên');

  // 4. Lấy ID của lĩnh vực và giảng viên
  const lvAI = await prisma.linhVucNghienCuu.findUnique({ where: { ma_linh_vuc: 'LV001' } });
  const lvWeb = await prisma.linhVucNghienCuu.findUnique({ where: { ma_linh_vuc: 'LV002' } });
  const lvSecurity = await prisma.linhVucNghienCuu.findUnique({ where: { ma_linh_vuc: 'LV003' } });
  const lvMobile = await prisma.linhVucNghienCuu.findUnique({ where: { ma_linh_vuc: 'LV004' } });
  const lvDataScience = await prisma.linhVucNghienCuu.findUnique({ where: { ma_linh_vuc: 'LV005' } });

  const gv1 = await prisma.giangVien.findUnique({ where: { ma_giang_vien: 'GV001' } });
  const gv2 = await prisma.giangVien.findUnique({ where: { ma_giang_vien: 'GV002' } });
  const gv3 = await prisma.giangVien.findUnique({ where: { ma_giang_vien: 'GV003' } });

  // 5. Tạo Đề tài nghiên cứu
  const deTais = [
    {
      ma_de_tai: 'DT001',
      ten_de_tai: 'Xây dựng hệ thống nhận diện khuôn mặt sử dụng Deep Learning',
      linh_vuc_id: lvAI.linh_vuc_id,
      mo_ta: 'Nghiên cứu và xây dựng hệ thống nhận diện khuôn mặt sử dụng các mô hình Deep Learning như CNN, FaceNet',
      muc_tieu: 'Xây dựng được hệ thống nhận diện khuôn mặt với độ chính xác cao trên 95%',
      yeu_cau: 'Sinh viên cần có kiến thức về Python, TensorFlow/PyTorch, xử lý ảnh',
      so_luong_thanh_vien_toi_da: 3,
      giang_vien_huong_dan_id: gv1.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: 'HK2',
    },
    {
      ma_de_tai: 'DT002',
      ten_de_tai: 'Phát triển ứng dụng quản lý thư viện trực tuyến',
      linh_vuc_id: lvWeb.linh_vuc_id,
      mo_ta: 'Xây dựng hệ thống quản lý thư viện với các chức năng mượn/trả sách, tìm kiếm, quản lý độc giả',
      muc_tieu: 'Hoàn thiện hệ thống quản lý thư viện với đầy đủ chức năng cơ bản',
      yeu_cau: 'Sinh viên cần biết React, Node.js, PostgreSQL',
      so_luong_thanh_vien_toi_da: 4,
      giang_vien_huong_dan_id: gv2.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: 'HK2',
    },
    {
      ma_de_tai: 'DT003',
      ten_de_tai: 'Nghiên cứu và triển khai hệ thống mã hóa end-to-end cho ứng dụng chat',
      linh_vuc_id: lvSecurity.linh_vuc_id,
      mo_ta: 'Nghiên cứu các thuật toán mã hóa và triển khai hệ thống chat bảo mật',
      muc_tieu: 'Xây dựng ứng dụng chat với mã hóa end-to-end đảm bảo an toàn',
      yeu_cau: 'Sinh viên cần có kiến thức về mật mã học, lập trình mạng',
      so_luong_thanh_vien_toi_da: 3,
      giang_vien_huong_dan_id: gv3.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: 'HK2',
    },
    {
      ma_de_tai: 'DT004',
      ten_de_tai: 'Xây dựng chatbot hỗ trợ tư vấn học tập sử dụng NLP',
      linh_vuc_id: lvAI.linh_vuc_id,
      mo_ta: 'Phát triển chatbot thông minh có khả năng trả lời câu hỏi về học tập',
      muc_tieu: 'Chatbot có thể hiểu và trả lời các câu hỏi phổ biến của sinh viên',
      yeu_cau: 'Sinh viên cần biết Python, NLP, Machine Learning',
      so_luong_thanh_vien_toi_da: 3,
      giang_vien_huong_dan_id: gv1.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: 'HK2',
    },
    {
      ma_de_tai: 'DT005',
      ten_de_tai: 'Phát triển ứng dụng mobile quản lý chi tiêu cá nhân',
      linh_vuc_id: lvMobile.linh_vuc_id,
      mo_ta: 'Xây dựng ứng dụng di động giúp người dùng quản lý thu chi cá nhân',
      muc_tieu: 'Ứng dụng hoạt động trên cả iOS và Android với giao diện thân thiện',
      yeu_cau: 'Sinh viên cần biết React Native hoặc Flutter',
      so_luong_thanh_vien_toi_da: 3,
      giang_vien_huong_dan_id: gv2.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: 'HK2',
    },
    {
      ma_de_tai: 'DT006',
      ten_de_tai: 'Phân tích dữ liệu bán hàng và dự đoán xu hướng',
      linh_vuc_id: lvDataScience.linh_vuc_id,
      mo_ta: 'Sử dụng các kỹ thuật phân tích dữ liệu để dự đoán xu hướng bán hàng',
      muc_tieu: 'Xây dựng mô hình dự đoán với độ chính xác cao',
      yeu_cau: 'Sinh viên cần biết Python, Pandas, Scikit-learn',
      so_luong_thanh_vien_toi_da: 4,
      giang_vien_huong_dan_id: gv1.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: 'HK2',
    },
    {
      ma_de_tai: 'DT007',
      ten_de_tai: 'Xây dựng hệ thống IoT giám sát môi trường',
      linh_vuc_id: lvWeb.linh_vuc_id,
      mo_ta: 'Phát triển hệ thống IoT thu thập và giám sát dữ liệu môi trường',
      muc_tieu: 'Hệ thống có thể thu thập và hiển thị dữ liệu real-time',
      yeu_cau: 'Sinh viên cần biết Arduino/Raspberry Pi, Node.js, MQTT',
      so_luong_thanh_vien_toi_da: 4,
      giang_vien_huong_dan_id: gv2.giang_vien_id,
      trang_thai: 'DANG_THUC_HIEN',
      nam_hoc: '2023-2024',
      hoc_ky: 'HK1',
    },
    {
      ma_de_tai: 'DT008',
      ten_de_tai: 'Nghiên cứu blockchain trong quản lý chuỗi cung ứng',
      linh_vuc_id: lvSecurity.linh_vuc_id,
      mo_ta: 'Ứng dụng công nghệ blockchain để tăng tính minh bạch trong chuỗi cung ứng',
      muc_tieu: 'Xây dựng prototype hệ thống quản lý chuỗi cung ứng trên blockchain',
      yeu_cau: 'Sinh viên cần có kiến thức về blockchain, smart contract',
      so_luong_thanh_vien_toi_da: 3,
      giang_vien_huong_dan_id: gv3.giang_vien_id,
      trang_thai: 'MO_DANG_KY',
      nam_hoc: '2023-2024',
      hoc_ky: 'HK2',
    },
  ];

  for (const dt of deTais) {
    await prisma.deTaiNghienCuu.upsert({
      where: { ma_de_tai: dt.ma_de_tai },
      update: {},
      create: dt,
    });
  }
  console.log('✓ Đã tạo', deTais.length, 'đề tài nghiên cứu');

  console.log('✅ Hoàn thành seed dữ liệu cho Thành viên 1!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
