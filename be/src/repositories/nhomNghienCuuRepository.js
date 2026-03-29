// Repository xử lý truy vấn database cho nhóm nghiên cứu
// Data Layer - Thành viên 2

const prisma = require('../config/prisma');

class NhomNghienCuuRepository {
  async findById(nhomId) {
    return await prisma.nhomNghienCuu.findUnique({
      where: { nhom_id: nhomId },
      include: {
        SinhVien: true,
        DeTaiNghienCuu: {
          include: {
            LinhVucNghienCuu: true
          }
        },
        GiangVien: true,
        ThanhVienNhom: {
          include: {
            SinhVien: true
          }
        }
      }
    });
  }

  async create(nhomData) {
    return await prisma.nhomNghienCuu.create({
      data: nhomData,
      include: {
        SinhVien: true,
        DeTaiNghienCuu: true,
        GiangVien: true
      }
    });
  }

  async update(nhomId, updateData) {
    return await prisma.nhomNghienCuu.update({
      where: { nhom_id: nhomId },
      data: updateData
    });
  }

  async addMember(nhomId, sinhVienId, vaiTro) {
    return await prisma.thanhVienNhom.create({
      data: {
        nhom_id: nhomId,
        sinh_vien_id: sinhVienId,
        vai_tro_trong_nhom: vaiTro,
        trang_thai: 1
      },
      include: {
        SinhVien: true
      }
    });
  }

  async removeMember(nhomId, sinhVienId) {
    return await prisma.thanhVienNhom.deleteMany({
      where: {
        nhom_id: nhomId,
        sinh_vien_id: sinhVienId
      }
    });
  }

  async getMembers(nhomId) {
    return await prisma.thanhVienNhom.findMany({
      where: {
        nhom_id: nhomId,
        trang_thai: 1
      },
      include: {
        SinhVien: {
          include: {
            Khoa: true
          }
        }
      },
      orderBy: { ngay_tham_gia: 'asc' }
    });
  }

  async checkMemberInGroup(nhomId, sinhVienId) {
    const count = await prisma.thanhVienNhom.count({
      where: {
        nhom_id: nhomId,
        sinh_vien_id: sinhVienId,
        trang_thai: 1
      }
    });
    return count > 0;
  }

  async checkSinhVienInGroup(sinhVienId) {
    const count = await prisma.thanhVienNhom.count({
      where: {
        sinh_vien_id: sinhVienId,
        trang_thai: 1,
        NhomNghienCuu: {
          trang_thai: { in: ['CHO_DUYET', 'DA_DUYET', 'DANG_THUC_HIEN'] }
        }
      }
    });
    return count > 0;
  }

  async updateMemberCount(nhomId) {
    const count = await prisma.thanhVienNhom.count({
      where: {
        nhom_id: nhomId,
        trang_thai: 1
      }
    });

    return await prisma.nhomNghienCuu.update({
      where: { nhom_id: nhomId },
      data: { so_luong_thanh_vien: count }
    });
  }

  async assignAdvisor(nhomId, giangVienId) {
    return await prisma.nhomNghienCuu.update({
      where: { nhom_id: nhomId },
      data: { giang_vien_huong_dan_id: giangVienId }
    });
  }

  async countByYear(year) {
    return await prisma.nhomNghienCuu.count({
      where: {
        ma_nhom: { startsWith: `NHOM${year}` }
      }
    });
  }
}

module.exports = new NhomNghienCuuRepository();
