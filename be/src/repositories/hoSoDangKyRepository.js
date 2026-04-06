const prisma = require('../config/prisma');

class HoSoDangKyRepository {
  async findMany(filters) {
    const { studentId, nhomId, lecturerId, trangThai } = filters;

    const where = {};

    if (nhomId) {
      where.nhom_id = nhomId;
    }

    if (studentId) {
      where.NhomNghienCuu = {
        ...(where.NhomNghienCuu || {}),
        ThanhVienNhom: {
          some: { sinh_vien_id: studentId }
        }
      };
    }

    if (lecturerId) {
      where.NhomNghienCuu = {
        ...(where.NhomNghienCuu || {}),
        giang_vien_huong_dan_id: lecturerId
      };
    }

    if (trangThai) {
      where.trang_thai = trangThai;
    }

    return prisma.hoSoDangKyDeTai.findMany({
      where,
      include: {
        NhomNghienCuu: {
          include: {
            SinhVien: true,
            GiangVien: true,
            ThanhVienNhom: {
              include: {
                SinhVien: true
              }
            }
          }
        },
        DeTaiNghienCuu: {
          include: {
            LinhVucNghienCuu: true,
            GiangVien: true
          }
        },
        LinhVucDeXuat: true
      },
      orderBy: { ngay_tao: 'desc' }
    });
  }

  async findById(hoSoId) {
    return prisma.hoSoDangKyDeTai.findUnique({
      where: { ho_so_id: hoSoId },
      include: {
        NhomNghienCuu: {
          include: {
            SinhVien: true,
            ThanhVienNhom: {
              include: {
                SinhVien: true
              }
            },
            GiangVien: true,
            DeTaiNghienCuu: {
              include: {
                LinhVucNghienCuu: true,
                GiangVien: true
              }
            }
          }
        },
        DeTaiNghienCuu: {
          include: {
            LinhVucNghienCuu: true,
            GiangVien: true
          }
        },
        LinhVucDeXuat: true,
        PheDuyetDeTai: {
          orderBy: { thoi_gian_duyet: 'desc' }
        }
      }
    });
  }

  async findByTopic(deTaiId) {
    return prisma.hoSoDangKyDeTai.findMany({
      where: {
        de_tai_id: deTaiId,
        trang_thai: { not: 'TU_CHOI' }
      }
    });
  }

  async checkGroupRegistered(nhomId) {
    const count = await prisma.hoSoDangKyDeTai.count({
      where: {
        nhom_id: nhomId,
        trang_thai: { in: ['CHO_PHE_DUYET', 'DA_NOP', 'DA_DUYET'] }
      }
    });
    return count > 0;
  }

  async create(hoSoData) {
    return prisma.hoSoDangKyDeTai.create({
      data: hoSoData,
      include: {
        NhomNghienCuu: true,
        DeTaiNghienCuu: true,
        LinhVucDeXuat: true
      }
    });
  }

  async update(hoSoId, updateData) {
    return prisma.hoSoDangKyDeTai.update({
      where: { ho_so_id: hoSoId },
      data: updateData
    });
  }

  async getApprovalHistory(hoSoId) {
    return prisma.pheDuyetDeTai.findMany({
      where: { ho_so_id: hoSoId },
      orderBy: { thoi_gian_duyet: 'asc' }
    });
  }
}

module.exports = new HoSoDangKyRepository();
