// Repository xử lý truy vấn database cho sinh viên
// Data Layer - Thành viên 2

const prisma = require('../config/prisma');

class SinhVienRepository {
  async findById(sinhVienId) {
    return await prisma.sinhVien.findUnique({
      where: { sinh_vien_id: sinhVienId },
      include: {
        Khoa: true
      }
    });
  }

  async search(keyword) {
    return await prisma.sinhVien.findMany({
      where: {
        trang_thai: 1,
        OR: [
          { ho_ten: { contains: keyword, mode: 'insensitive' } },
          { ma_sinh_vien: { contains: keyword, mode: 'insensitive' } },
          { email: { contains: keyword, mode: 'insensitive' } }
        ]
      },
      include: {
        Khoa: true
      },
      take: 20,
      orderBy: { ho_ten: 'asc' }
    });
  }

  async findMany(filters) {
    const { khoaId, lop, khoaHoc } = filters;
    
    const where = {
      trang_thai: 1
    };

    if (khoaId) {
      where.khoa_id = khoaId;
    }

    if (lop) {
      where.lop = lop;
    }

    if (khoaHoc) {
      where.khoa_hoc = khoaHoc;
    }

    return await prisma.sinhVien.findMany({
      where,
      include: {
        Khoa: true
      },
      orderBy: { ho_ten: 'asc' }
    });
  }

  async create(sinhVienData) {
    return await prisma.sinhVien.create({
      data: sinhVienData
    });
  }

  async update(sinhVienId, updateData) {
    return await prisma.sinhVien.update({
      where: { sinh_vien_id: sinhVienId },
      data: updateData
    });
  }
}

module.exports = new SinhVienRepository();
