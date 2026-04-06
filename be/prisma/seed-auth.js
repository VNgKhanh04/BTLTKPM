require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { hashPassword } = require('../src/utils/auth');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = '123456';

async function ensureRole(tenVaiTro, moTa) {
  return prisma.vaiTro.upsert({
    where: { ten_vai_tro: tenVaiTro },
    update: {
      mo_ta: moTa,
      trang_thai: 1,
    },
    create: {
      ten_vai_tro: tenVaiTro,
      mo_ta: moTa,
      trang_thai: 1,
    },
  });
}

async function upsertAccount({ username, vaiTroId, nguoiDungId, loaiNguoiDung }) {
  const existed = await prisma.taiKhoan.findUnique({
    where: { ten_dang_nhap: username },
  });

  if (existed) {
    return prisma.taiKhoan.update({
      where: { tai_khoan_id: existed.tai_khoan_id },
      data: {
        vai_tro_id: vaiTroId,
        nguoi_dung_id: nguoiDungId,
        loai_nguoi_dung: loaiNguoiDung,
        mat_khau_hash: hashPassword(DEFAULT_PASSWORD),
        trang_thai: 1,
      },
    });
  }

  return prisma.taiKhoan.create({
    data: {
      ten_dang_nhap: username,
      mat_khau_hash: hashPassword(DEFAULT_PASSWORD),
      vai_tro_id: vaiTroId,
      nguoi_dung_id: nguoiDungId,
      loai_nguoi_dung: loaiNguoiDung,
      trang_thai: 1,
    },
  });
}

async function main() {
  console.log('Đang tạo vai trò và tài khoản mẫu...');

  const roleSinhVien = await ensureRole('SINH_VIEN', 'Tài khoản sinh viên');
  const roleGiangVien = await ensureRole('GIANG_VIEN', 'Tài khoản giảng viên');
  const roleCanBoQuanLy = await ensureRole('CAN_BO_QUAN_LY', 'Tài khoản cán bộ quản lý khoa học');
  const roleQuanTri = await ensureRole('QUAN_TRI_HE_THONG', 'Tài khoản quản trị');

  const sinhViens = await prisma.sinhVien.findMany({
    orderBy: { ma_sinh_vien: 'asc' },
    take: 5,
  });

  const giangViens = await prisma.giangVien.findMany({
    orderBy: { ma_giang_vien: 'asc' },
    take: 5,
  });

  for (const sinhVien of sinhViens) {
    await upsertAccount({
      username: sinhVien.ma_sinh_vien,
      vaiTroId: roleSinhVien.vai_tro_id,
      nguoiDungId: sinhVien.sinh_vien_id,
      loaiNguoiDung: 'SINH_VIEN',
    });
  }

  for (const giangVien of giangViens) {
    await upsertAccount({
      username: giangVien.ma_giang_vien,
      vaiTroId: roleGiangVien.vai_tro_id,
      nguoiDungId: giangVien.giang_vien_id,
      loaiNguoiDung: 'GIANG_VIEN',
    });
  }

  await upsertAccount({
    username: 'CBQL001',
    vaiTroId: roleCanBoQuanLy.vai_tro_id,
    nguoiDungId: 0,
    loaiNguoiDung: 'CAN_BO_QUAN_LY',
  });

  await upsertAccount({
    username: 'admin',
    vaiTroId: roleQuanTri.vai_tro_id,
    nguoiDungId: 0,
    loaiNguoiDung: 'QUAN_TRI_HE_THONG',
  });

  console.log(`Đã tạo tài khoản mẫu. Mật khẩu mặc định: ${DEFAULT_PASSWORD}`);
  console.log('Sinh viên đăng nhập ví dụ: SV001');
  console.log('Giảng viên đăng nhập ví dụ: GV001');
  console.log('Cán bộ quản lý đăng nhập: CBQL001');
  console.log('Quản trị đăng nhập: admin');
}

main()
  .catch((error) => {
    console.error('Seed auth thất bại:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
