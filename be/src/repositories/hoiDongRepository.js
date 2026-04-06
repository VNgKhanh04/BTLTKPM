const prisma = require('../config/prisma');

class HoiDongRepository {
  async findMany() {
    return prisma.hoiDongKhoaHoc.findMany({
      where: {
        trang_thai: 1,
      },
      include: {
        ThanhVienHoiDong: {
          where: {
            trang_thai: 1,
          },
          include: {
            GiangVien: {
              include: {
                Khoa: true,
              },
            },
          },
        },
      },
      orderBy: {
        ten_hoi_dong: 'asc',
      },
    });
  }

  async findById(hoiDongId) {
    return prisma.hoiDongKhoaHoc.findUnique({
      where: { hoi_dong_id: hoiDongId },
      include: {
        ThanhVienHoiDong: {
          where: {
            trang_thai: 1,
          },
          include: {
            GiangVien: {
              include: {
                Khoa: true,
              },
            },
          },
        },
      },
    });
  }
}

module.exports = new HoiDongRepository();
