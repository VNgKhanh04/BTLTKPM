// Seed data cho Thành viên 3: Giảng viên hướng dẫn
// Script này tạo dữ liệu mẫu cho giảng viên

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
  console.log('🌱 Bắt đầu seed dữ liệu giảng viên...');

  // Lấy các khoa đã có
  const khoas = await prisma.khoa.findMany();
  if (khoas.length === 0) {
    console.log('⚠️  Chưa có khoa nào. Vui lòng chạy seed-thanh-vien-1.js trước');
    return;
  }

  const khoaCNTT = khoas.find(k => k.ma_khoa === 'CNTT');
  const khoaKT = khoas.find(k => k.ma_khoa === 'KT');
  const khoaNN = khoas.find(k => k.ma_khoa === 'NN');

  // Tạo giảng viên
  const giangViens = [
    // Khoa CNTT
    {
      ma_giang_vien: 'GV001',
      ho_ten: 'TS. Nguyễn Văn An',
      email: 'nva@university.edu.vn',
      so_dien_thoai: '0901234567',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'Trí tuệ nhân tạo, Machine Learning, Deep Learning',
      so_luong_huong_dan_toi_da: 5,
      trang_thai: 1
    },
    {
      ma_giang_vien: 'GV002',
      ho_ten: 'PGS.TS. Trần Thị Bình',
      email: 'ttb@university.edu.vn',
      so_dien_thoai: '0901234568',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'Phát triển phần mềm, Kiến trúc phần mềm, DevOps',
      so_luong_huong_dan_toi_da: 6,
      trang_thai: 1
    },
    {
      ma_giang_vien: 'GV003',
      ho_ten: 'TS. Lê Văn Cường',
      email: 'lvc@university.edu.vn',
      so_dien_thoai: '0901234569',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'An toàn thông tin, Mật mã học, Blockchain',
      so_luong_huong_dan_toi_da: 4,
      trang_thai: 1
    },
    {
      ma_giang_vien: 'GV004',
      ho_ten: 'ThS. Phạm Thị Dung',
      email: 'ptd@university.edu.vn',
      so_dien_thoai: '0901234570',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'Cơ sở dữ liệu, Big Data, Data Mining',
      so_luong_huong_dan_toi_da: 5,
      trang_thai: 1
    },
    {
      ma_giang_vien: 'GV005',
      ho_ten: 'TS. Hoàng Văn Em',
      email: 'hve@university.edu.vn',
      so_dien_thoai: '0901234571',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'Mạng máy tính, IoT, Cloud Computing',
      so_luong_huong_dan_toi_da: 5,
      trang_thai: 1
    },
    {
      ma_giang_vien: 'GV006',
      ho_ten: 'ThS. Đỗ Thị Phương',
      email: 'dtp@university.edu.vn',
      so_dien_thoai: '0901234572',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'Phát triển Web, Mobile App, UI/UX Design',
      so_luong_huong_dan_toi_da: 6,
      trang_thai: 1
    },
    {
      ma_giang_vien: 'GV007',
      ho_ten: 'TS. Vũ Văn Giang',
      email: 'vvg@university.edu.vn',
      so_dien_thoai: '0901234573',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'Xử lý ảnh, Computer Vision, Pattern Recognition',
      so_luong_huong_dan_toi_da: 4,
      trang_thai: 1
    },
    {
      ma_giang_vien: 'GV008',
      ho_ten: 'PGS.TS. Ngô Thị Hoa',
      email: 'nth@university.edu.vn',
      so_dien_thoai: '0901234574',
      khoa_id: khoaCNTT.khoa_id,
      chuyen_mon: 'Trí tuệ nhân tạo, Natural Language Processing, Chatbot',
      so_luong_huong_dan_toi_da: 5,
      trang_thai: 1
    },

    // Khoa Kinh tế
    {
      ma_giang_vien: 'GV009',
      ho_ten: 'TS. Bùi Văn Khánh',
      email: 'bvk@university.edu.vn',
      so_dien_thoai: '0901234575',
      khoa_id: khoaKT.khoa_id,
      chuyen_mon: 'Kinh tế học, Phân tích tài chính, Đầu tư',
      so_luong_huong_dan_toi_da: 5,
      trang_thai: 1
    },
    {
      ma_giang_vien: 'GV010',
      ho_ten: 'ThS. Lý Thị Lan',
      email: 'ltl@university.edu.vn',
      so_dien_thoai: '0901234576',
      khoa_id: khoaKT.khoa_id,
      chuyen_mon: 'Marketing, Quản trị thương hiệu, Digital Marketing',
      so_luong_huong_dan_toi_da: 6,
      trang_thai: 1
    },

    // Khoa Ngoại ngữ
    {
      ma_giang_vien: 'GV011',
      ho_ten: 'TS. Mai Văn Minh',
      email: 'mvm@university.edu.vn',
      so_dien_thoai: '0901234577',
      khoa_id: khoaNN.khoa_id,
      chuyen_mon: 'Ngôn ngữ học, Dịch thuật, Văn hóa học',
      so_luong_huong_dan_toi_da: 5,
      trang_thai: 1
    },
    {
      ma_giang_vien: 'GV012',
      ho_ten: 'ThS. Phan Thị Nga',
      email: 'ptn@university.edu.vn',
      so_dien_thoai: '0901234578',
      khoa_id: khoaNN.khoa_id,
      chuyen_mon: 'Giảng dạy tiếng Anh, TESOL, Applied Linguistics',
      so_luong_huong_dan_toi_da: 6,
      trang_thai: 1
    }
  ];

  console.log('📝 Đang tạo giảng viên...');
  
  for (const gvData of giangViens) {
    const existing = await prisma.giangVien.findUnique({
      where: { ma_giang_vien: gvData.ma_giang_vien }
    });

    if (existing) {
      console.log(`   ⏭️  Giảng viên ${gvData.ma_giang_vien} đã tồn tại, bỏ qua`);
      continue;
    }

    const gv = await prisma.giangVien.create({
      data: gvData
    });
    console.log(`   ✅ Tạo giảng viên: ${gv.ho_ten} (${gv.ma_giang_vien})`);
  }

  // Gán một số giảng viên cho các đề tài đã có
  console.log('\n📝 Đang gán giảng viên cho đề tài...');
  
  const deTais = await prisma.deTaiNghienCuu.findMany({
    where: { giang_vien_huong_dan_id: null }
  });

  if (deTais.length > 0) {
    const gvCNTT = await prisma.giangVien.findMany({
      where: { khoa_id: khoaCNTT.khoa_id }
    });

    for (let i = 0; i < Math.min(deTais.length, gvCNTT.length); i++) {
      await prisma.deTaiNghienCuu.update({
        where: { de_tai_id: deTais[i].de_tai_id },
        data: { giang_vien_huong_dan_id: gvCNTT[i].giang_vien_id }
      });
      console.log(`   ✅ Gán ${gvCNTT[i].ho_ten} cho đề tài: ${deTais[i].ten_de_tai}`);
    }
  }

  console.log('\n✅ Seed dữ liệu giảng viên hoàn tất!');
  console.log(`📊 Tổng số giảng viên: ${giangViens.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
