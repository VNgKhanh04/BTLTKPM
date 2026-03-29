// Repository xử lý truy vấn database cho thông báo
// Data Layer - Thành viên 5

const prisma = require('../config/prisma');

class ThongBaoRepository {
  async findMany(filters) {
    const { nguoiNhanId, loaiNguoiNhan, daDoc } = filters;
    
    const where = {};

    if (nguoiNhanId) {
      where.nguoi_nhan_id = nguoiNhanId;
    }

    if (loaiNguoiNhan) {
      where.loai_nguoi_nhan = loaiNguoiNhan;
    }

    if (daDoc !== undefined) {
      where.da_doc = daDoc;
    }

    return await prisma.thongBao.findMany({
      where,
      orderBy: { thoi_gian_gui: 'desc' },
      take: 50
    });
  }

  async findById(thongBaoId) {
    return await prisma.thongBao.findUnique({
      where: { thong_bao_id: thongBaoId }
    });
  }

  async create(thongBaoData) {
    return await prisma.thongBao.create({
      data: thongBaoData
    });
  }

  async update(thongBaoId, updateData) {
    return await prisma.thongBao.update({
      where: { thong_bao_id: thongBaoId },
      data: updateData
    });
  }

  async countUnread(nguoiNhanId, loaiNguoiNhan) {
    return await prisma.thongBao.count({
      where: {
        nguoi_nhan_id: nguoiNhanId,
        loai_nguoi_nhan: loaiNguoiNhan,
        da_doc: false
      }
    });
  }

  async markAllAsRead(nguoiNhanId, loaiNguoiNhan) {
    return await prisma.thongBao.updateMany({
      where: {
        nguoi_nhan_id: nguoiNhanId,
        loai_nguoi_nhan: loaiNguoiNhan,
        da_doc: false
      },
      data: {
        da_doc: true
      }
    });
  }
}

module.exports = new ThongBaoRepository();
