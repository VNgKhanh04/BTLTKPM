// Repository xử lý truy vấn database cho giảng viên
// Data Layer - Thành viên 3

const prisma = require('../config/prisma');

class GiangVienRepository {
  async findMany(filters) {
    const { specialization, keyword } = filters;
    
    const where = {
      trang_thai: 1
    };

    if (specialization) {
      where.chuyen_mon = { contains: specialization, mode: 'insensitive' };
    }

    if (keyword) {
      where.OR = [
        { ho_ten: { contains: keyword, mode: 'insensitive' } },
        { ma_giang_vien: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } }
      ];
    }

    return await prisma.giangVien.findMany({
      where,
      include: {
        Khoa: true
      },
      orderBy: { ho_ten: 'asc' }
    });
  }

  async findById(giangVienId) {
    return await prisma.giangVien.findUnique({
      where: { giang_vien_id: giangVienId },
      include: {
        Khoa: true,
        DeTaiNghienCuu: {
          where: { trang_thai: { not: 'HOAN_THANH' } }
        },
        NhomNghienCuu: {
          where: { trang_thai: { not: 'HOAN_THANH' } }
        }
      }
    });
  }

  async countCurrentlySupervising(giangVienId) {
    return await prisma.nhomNghienCuu.count({
      where: {
        giang_vien_huong_dan_id: giangVienId,
        trang_thai: { in: ['CHO_DUYET', 'DA_DUYET', 'DANG_THUC_HIEN'] }
      }
    });
  }

  async create(giangVienData) {
    return await prisma.giangVien.create({
      data: giangVienData
    });
  }

  async update(giangVienId, updateData) {
    return await prisma.giangVien.update({
      where: { giang_vien_id: giangVienId },
      data: updateData
    });
  }
}

module.exports = new GiangVienRepository();
