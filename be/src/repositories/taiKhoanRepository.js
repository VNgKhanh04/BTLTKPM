const prisma = require('../config/prisma');

class TaiKhoanRepository {
  async findByUsername(tenDangNhap) {
    return prisma.taiKhoan.findUnique({
      where: { ten_dang_nhap: tenDangNhap },
      include: {
        VaiTro: true,
      },
    });
  }

  async findById(taiKhoanId) {
    return prisma.taiKhoan.findUnique({
      where: { tai_khoan_id: taiKhoanId },
      include: {
        VaiTro: true,
      },
    });
  }

  async update(taiKhoanId, data) {
    return prisma.taiKhoan.update({
      where: { tai_khoan_id: taiKhoanId },
      data,
      include: {
        VaiTro: true,
      },
    });
  }
}

module.exports = new TaiKhoanRepository();
