// Repository xử lý truy vấn database cho lĩnh vực
// Data Layer - Thành viên 1

const prisma = require('../config/prisma');

class LinhVucRepository {
  async findAll() {
    return await prisma.linhVucNghienCuu.findMany({
      where: { trang_thai: 1 },
      orderBy: { ten_linh_vuc: 'asc' }
    });
  }

  async findById(linhVucId) {
    return await prisma.linhVucNghienCuu.findUnique({
      where: { linh_vuc_id: linhVucId },
      include: {
        DeTaiNghienCuu: {
          where: { trang_thai: 'MO_DANG_KY' },
          take: 10
        }
      }
    });
  }

  async create(linhVucData) {
    return await prisma.linhVucNghienCuu.create({
      data: linhVucData
    });
  }

  async update(linhVucId, updateData) {
    return await prisma.linhVucNghienCuu.update({
      where: { linh_vuc_id: linhVucId },
      data: updateData
    });
  }
}

module.exports = new LinhVucRepository();
