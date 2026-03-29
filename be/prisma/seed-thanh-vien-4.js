// Seed data cho Thành viên 4: Hồ sơ đăng ký đề tài
// Script này tạo dữ liệu mẫu cho hồ sơ đăng ký

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
  console.log('🌱 Bắt đầu seed dữ liệu hồ sơ đăng ký...');

  // Lấy các nhóm và đề tài đã có
  const nhoms = await prisma.nhomNghienCuu.findMany({
    where: { giang_vien_huong_dan_id: { not: null } }
  });

  const deTais = await prisma.deTaiNghienCuu.findMany({
    where: { trang_thai: 'MO_DANG_KY' }
  });

  if (nhoms.length === 0) {
    console.log('⚠️  Chưa có nhóm nào. Vui lòng chạy seed-thanh-vien-2.js và seed-thanh-vien-3.js trước');
    return;
  }

  if (deTais.length === 0) {
    console.log('⚠️  Chưa có đề tài nào. Vui lòng chạy seed-thanh-vien-1.js trước');
    return;
  }

  console.log(`📊 Tìm thấy ${nhoms.length} nhóm và ${deTais.length} đề tài`);

  // Tạo hồ sơ đăng ký mẫu
  const hoSoSamples = [
    {
      nhom_id: nhoms[0]?.nhom_id,
      de_tai_id: deTais[0]?.de_tai_id,
      ly_do_chon_de_tai: 'Nhóm chúng em rất quan tâm đến lĩnh vực trí tuệ nhân tạo và muốn nghiên cứu sâu về ứng dụng AI trong thực tế. Đề tài này phù hợp với định hướng nghề nghiệp của các thành viên trong nhóm.',
      trang_thai: 'CHO_PHE_DUYET',
      nguoi_tao_id: nhoms[0]?.truong_nhom_id
    },
    {
      nhom_id: nhoms[1]?.nhom_id,
      de_tai_id: deTais[1]?.de_tai_id,
      ly_do_chon_de_tai: 'Chúng em muốn tìm hiểu về phát triển ứng dụng web hiện đại và các công nghệ mới nhất. Đề tài này giúp nhóm có cơ hội thực hành và áp dụng kiến thức đã học vào dự án thực tế.',
      trang_thai: 'DA_NOP',
      nguoi_tao_id: nhoms[1]?.truong_nhom_id
    },
    {
      nhom_id: nhoms[2]?.nhom_id,
      de_tai_id: deTais[2]?.de_tai_id,
      ly_do_chon_de_tai: 'An toàn thông tin là một lĩnh vực quan trọng và đang phát triển mạnh mẽ. Nhóm chúng em mong muốn đóng góp vào việc nâng cao nhận thức về bảo mật trong cộng đồng.',
      trang_thai: 'DA_DUYET',
      nguoi_tao_id: nhoms[2]?.truong_nhom_id,
      ghi_chu: 'Hồ sơ đã được phê duyệt. Nhóm có thể bắt đầu thực hiện đề tài.'
    }
  ];

  console.log('\n📝 Đang tạo hồ sơ đăng ký...');

  for (const hoSoData of hoSoSamples) {
    if (!hoSoData.nhom_id || !hoSoData.de_tai_id) {
      console.log('   ⏭️  Bỏ qua hồ sơ do thiếu dữ liệu');
      continue;
    }

    // Kiểm tra nhóm đã đăng ký chưa
    const existing = await prisma.hoSoDangKyDeTai.findFirst({
      where: { nhom_id: hoSoData.nhom_id }
    });

    if (existing) {
      console.log(`   ⏭️  Nhóm ${hoSoData.nhom_id} đã có hồ sơ đăng ký, bỏ qua`);
      continue;
    }

    const hoSo = await prisma.hoSoDangKyDeTai.create({
      data: hoSoData,
      include: {
        NhomNghienCuu: true,
        DeTaiNghienCuu: true
      }
    });

    console.log(`   ✅ Tạo hồ sơ: ${hoSo.NhomNghienCuu.ten_nhom} - ${hoSo.DeTaiNghienCuu.ten_de_tai}`);
    console.log(`      Trạng thái: ${hoSo.trang_thai}`);

    // Tạo phê duyệt cho hồ sơ đã duyệt
    if (hoSo.trang_thai === 'DA_DUYET') {
      const nhom = await prisma.nhomNghienCuu.findUnique({
        where: { nhom_id: hoSo.nhom_id }
      });

      if (nhom.giang_vien_huong_dan_id) {
        await prisma.pheDuyetDeTai.create({
          data: {
            ho_so_id: hoSo.ho_so_id,
            nguoi_duyet_id: nhom.giang_vien_huong_dan_id,
            loai_nguoi_duyet: 'GIANG_VIEN',
            ket_qua: 'DUYET',
            nhan_xet: 'Hồ sơ đầy đủ và phù hợp. Nhóm có thể bắt đầu thực hiện đề tài.'
          }
        });
        console.log(`      ✅ Tạo phê duyệt cho hồ sơ`);
      }
    }
  }

  // Tạo thông báo mẫu
  console.log('\n📬 Đang tạo thông báo...');

  const hoSos = await prisma.hoSoDangKyDeTai.findMany({
    include: {
      NhomNghienCuu: {
        include: {
          SinhVien: true,
          GiangVien: true
        }
      },
      DeTaiNghienCuu: true
    }
  });

  for (const hoSo of hoSos) {
    // Thông báo cho sinh viên
    if (hoSo.NhomNghienCuu.truong_nhom_id) {
      const existingNotif = await prisma.thongBao.findFirst({
        where: {
          nguoi_nhan_id: hoSo.NhomNghienCuu.truong_nhom_id,
          loai_thong_bao: 'DANG_KY_DE_TAI'
        }
      });

      if (!existingNotif) {
        await prisma.thongBao.create({
          data: {
            tieu_de: 'Hồ sơ đăng ký đề tài',
            noi_dung: `Hồ sơ đăng ký đề tài "${hoSo.DeTaiNghienCuu.ten_de_tai}" của nhóm ${hoSo.NhomNghienCuu.ten_nhom} đang ở trạng thái: ${hoSo.trang_thai}`,
            nguoi_nhan_id: hoSo.NhomNghienCuu.truong_nhom_id,
            loai_nguoi_nhan: 'SINH_VIEN',
            loai_thong_bao: 'DANG_KY_DE_TAI',
            da_doc: false
          }
        });
        console.log(`   ✅ Tạo thông báo cho sinh viên ${hoSo.NhomNghienCuu.SinhVien.ho_ten}`);
      }
    }

    // Thông báo cho giảng viên
    if (hoSo.NhomNghienCuu.giang_vien_huong_dan_id) {
      const existingNotif = await prisma.thongBao.findFirst({
        where: {
          nguoi_nhan_id: hoSo.NhomNghienCuu.giang_vien_huong_dan_id,
          loai_thong_bao: 'DANG_KY_DE_TAI'
        }
      });

      if (!existingNotif) {
        await prisma.thongBao.create({
          data: {
            tieu_de: 'Hồ sơ đăng ký đề tài mới',
            noi_dung: `Nhóm ${hoSo.NhomNghienCuu.ten_nhom} đã đăng ký đề tài "${hoSo.DeTaiNghienCuu.ten_de_tai}". Vui lòng xem xét và phê duyệt.`,
            nguoi_nhan_id: hoSo.NhomNghienCuu.giang_vien_huong_dan_id,
            loai_nguoi_nhan: 'GIANG_VIEN',
            loai_thong_bao: 'DANG_KY_DE_TAI',
            da_doc: false
          }
        });
        console.log(`   ✅ Tạo thông báo cho giảng viên ${hoSo.NhomNghienCuu.GiangVien?.ho_ten}`);
      }
    }
  }

  console.log('\n✅ Seed dữ liệu hồ sơ đăng ký hoàn tất!');
  console.log(`📊 Tổng số hồ sơ: ${hoSos.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
