require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function upsertCouncil(data) {
  return prisma.hoiDongKhoaHoc.upsert({
    where: { ma_hoi_dong: data.ma_hoi_dong },
    update: {
      ten_hoi_dong: data.ten_hoi_dong,
      cap_hoi_dong: data.cap_hoi_dong,
      nam_hoc: data.nam_hoc,
      mo_ta: data.mo_ta,
      trang_thai: 1,
    },
    create: data,
  });
}

async function ensureCouncilMembers(hoiDongId, members) {
  for (const member of members) {
    await prisma.thanhVienHoiDong.upsert({
      where: {
        hoi_dong_id_giang_vien_id: {
          hoi_dong_id: hoiDongId,
          giang_vien_id: member.giang_vien_id,
        },
      },
      update: {
        vai_tro_trong_hoi_dong: member.vai_tro_trong_hoi_dong,
        trang_thai: 1,
      },
      create: {
        hoi_dong_id: hoiDongId,
        giang_vien_id: member.giang_vien_id,
        vai_tro_trong_hoi_dong: member.vai_tro_trong_hoi_dong,
        trang_thai: 1,
      },
    });
  }
}

async function ensureFinalReport(group) {
  const existing = await prisma.baoCaoCuoiCung.findFirst({
    where: {
      nhom_id: group.nhom_id,
      de_tai_id: group.de_tai_id,
    },
  });

  if (existing) {
    return prisma.baoCaoCuoiCung.update({
      where: { bao_cao_cuoi_cung_id: existing.bao_cao_cuoi_cung_id },
      data: {
        du_dieu_kien_bao_ve: true,
        trang_thai: 'DA_NOP',
        nhan_xet_gvhd: 'Đã đủ điều kiện bảo vệ.',
      },
    });
  }

  return prisma.baoCaoCuoiCung.create({
    data: {
      de_tai_id: group.de_tai_id,
      nhom_id: group.nhom_id,
      tieu_de: `Báo cáo cuối cùng - ${group.DeTaiNghienCuu.ten_de_tai}`,
      tom_tat: 'Báo cáo mẫu phục vụ chức năng tổ chức bảo vệ đề tài.',
      du_dieu_kien_bao_ve: true,
      nhan_xet_gvhd: 'Đã đủ điều kiện bảo vệ.',
      trang_thai: 'DA_NOP',
    },
  });
}

async function main() {
  console.log('Đang tạo dữ liệu mẫu cho chức năng tổ chức bảo vệ đề tài...');

  const lecturers = await prisma.giangVien.findMany({
    where: { trang_thai: 1 },
    orderBy: { ma_giang_vien: 'asc' },
    take: 5,
  });

  if (lecturers.length < 3) {
    throw new Error('Cần ít nhất 3 giảng viên để tạo hội đồng khoa học mẫu');
  }

  const currentYear = new Date().getFullYear();
  const currentAcademicYear = `${currentYear - 1}-${currentYear}`;

  const hoiDong1 = await upsertCouncil({
    ma_hoi_dong: 'HD001',
    ten_hoi_dong: 'Hội đồng bảo vệ đề tài số 1',
    cap_hoi_dong: 'CAP_KHOA',
    nam_hoc: currentAcademicYear,
    mo_ta: 'Hội đồng mẫu phục vụ xếp lịch bảo vệ đợt 1',
    trang_thai: 1,
  });

  await ensureCouncilMembers(hoiDong1.hoi_dong_id, [
    { giang_vien_id: lecturers[0].giang_vien_id, vai_tro_trong_hoi_dong: 'CHU_TICH' },
    { giang_vien_id: lecturers[1].giang_vien_id, vai_tro_trong_hoi_dong: 'THU_KY' },
    { giang_vien_id: lecturers[2].giang_vien_id, vai_tro_trong_hoi_dong: 'PHAN_BIEN' },
  ]);

  if (lecturers.length >= 5) {
    const hoiDong2 = await upsertCouncil({
      ma_hoi_dong: 'HD002',
      ten_hoi_dong: 'Hội đồng bảo vệ đề tài số 2',
      cap_hoi_dong: 'CAP_KHOA',
      nam_hoc: currentAcademicYear,
      mo_ta: 'Hội đồng mẫu phục vụ xếp lịch bảo vệ đợt 2',
      trang_thai: 1,
    });

    await ensureCouncilMembers(hoiDong2.hoi_dong_id, [
      { giang_vien_id: lecturers[3].giang_vien_id, vai_tro_trong_hoi_dong: 'CHU_TICH' },
      { giang_vien_id: lecturers[4].giang_vien_id, vai_tro_trong_hoi_dong: 'THU_KY' },
      { giang_vien_id: lecturers[0].giang_vien_id, vai_tro_trong_hoi_dong: 'PHAN_BIEN' },
    ]);
  }

  const groups = await prisma.nhomNghienCuu.findMany({
    where: {
      de_tai_id: { not: null },
      trang_thai: { in: ['DA_DUYET', 'DA_XEP_LICH', 'DANG_THUC_HIEN', 'CHO_DUYET'] },
    },
    include: {
      DeTaiNghienCuu: true,
    },
    take: 3,
  });

  if (groups.length === 0) {
    throw new Error('Không tìm thấy nhóm có đề tài để tạo dữ liệu đủ điều kiện bảo vệ');
  }

  for (const group of groups) {
    await ensureFinalReport(group);
  }

  console.log('Đã tạo dữ liệu mẫu cho hội đồng và đề tài đủ điều kiện bảo vệ.');
}

main()
  .catch((error) => {
    console.error('Seed defense thất bại:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
