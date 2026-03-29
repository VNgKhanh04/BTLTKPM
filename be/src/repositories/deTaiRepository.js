// Repository xử lý truy vấn database cho đề tài
// Data Layer - Thành viên 1

const prisma = require('../config/prisma');

class DeTaiRepository {
  async findMany(filters) {
    const { skip, take, keyword, fieldId, status, namHoc, hocKy } = filters;
    
    const where = {};

    if (keyword) {
      where.OR = [
        { ten_de_tai: { contains: keyword, mode: 'insensitive' } },
        { ma_de_tai: { contains: keyword, mode: 'insensitive' } }
      ];
    }

    if (fieldId) {
      where.linh_vuc_id = fieldId;
    }

    if (status) {
      where.trang_thai = status;
    }

    if (namHoc) {
      where.nam_hoc = namHoc;
    }

    if (hocKy) {
      where.hoc_ky = hocKy;
    }

    const [deTais, total] = await Promise.all([
      prisma.deTaiNghienCuu.findMany({
        where,
        skip,
        take,
        include: {
          LinhVucNghienCuu: true,
          GiangVien: {
            select: {
              giang_vien_id: true,
              ho_ten: true,
              email: true,
              chuyen_mon: true
            }
          }
        },
        orderBy: { ngay_tao: 'desc' }
      }),
      prisma.deTaiNghienCuu.count({ where })
    ]);

    return { deTais, total };
  }

  async findById(deTaiId) {
    if (deTaiId === undefined || deTaiId === null || deTaiId === '') {
      return null;
    }

    return await prisma.deTaiNghienCuu.findUnique({
      where: { de_tai_id: deTaiId },
      include: {
        LinhVucNghienCuu: true,
        GiangVien: {
          select: {
            giang_vien_id: true,
            ho_ten: true,
            email: true,
            chuyen_mon: true
          }
        },
        NhomNghienCuu: {
          include: {
            SinhVien: true
          }
        }
      }
    });
  }

  async countRegisteredGroups(deTaiId) {
    return await prisma.hoSoDangKyDeTai.count({
      where: {
        de_tai_id: deTaiId,
        trang_thai: { in: ['CHO_PHE_DUYET', 'DA_NOP', 'DA_DUYET'] }
      }
    });
  }

  async create(deTaiData) {
    return await prisma.deTaiNghienCuu.create({
      data: deTaiData
    });
  }

  async update(deTaiId, updateData) {
    return await prisma.deTaiNghienCuu.update({
      where: { de_tai_id: deTaiId },
      data: updateData
    });
  }
}

module.exports = new DeTaiRepository();
