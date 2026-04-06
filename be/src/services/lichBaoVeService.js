const prisma = require('../config/prisma');
const hoiDongService = require('./hoiDongService');
const thongBaoService = require('./thongBaoService');

class LichBaoVeService {
  async getDanhSachDeTaiDuDieuKien(filters = {}) {
    const { namHoc, hocKy } = filters;

    const where = {
      du_dieu_kien_bao_ve: true,
      NhomNghienCuu: {
        trang_thai: {
          not: 'TU_CHOI',
        },
        LichBaoVe: {
          none: {},
        },
      },
      DeTaiNghienCuu: {
        LichBaoVe: {
          none: {},
        },
      },
    };

    if (namHoc || hocKy) {
      where.DeTaiNghienCuu = {
        ...(where.DeTaiNghienCuu || {}),
      };

      if (namHoc) {
        where.DeTaiNghienCuu.nam_hoc = namHoc;
      }

      if (hocKy) {
        where.DeTaiNghienCuu.hoc_ky = hocKy;
      }
    }

    return prisma.baoCaoCuoiCung.findMany({
      where,
      include: {
        DeTaiNghienCuu: {
          include: {
            LinhVucNghienCuu: true,
            GiangVien: true,
          },
        },
        NhomNghienCuu: {
          include: {
            SinhVien: true,
            GiangVien: true,
            ThanhVienNhom: {
              where: {
                trang_thai: 1,
              },
              include: {
                SinhVien: true,
              },
            },
          },
        },
      },
      orderBy: {
        ngay_nop: 'desc',
      },
    });
  }

  async getDanhSachLichBaoVe(filters = {}) {
    const { namHoc, hocKy } = filters;
    const where = {};

    if (namHoc || hocKy) {
      where.DeTaiNghienCuu = {};

      if (namHoc) {
        where.DeTaiNghienCuu.nam_hoc = namHoc;
      }

      if (hocKy) {
        where.DeTaiNghienCuu.hoc_ky = hocKy;
      }
    }

    return prisma.lichBaoVe.findMany({
      where,
      include: {
        DeTaiNghienCuu: {
          include: {
            GiangVien: true,
          },
        },
        NhomNghienCuu: {
          include: {
            SinhVien: true,
            ThanhVienNhom: {
              where: {
                trang_thai: 1,
              },
              include: {
                SinhVien: true,
              },
            },
          },
        },
        HoiDongKhoaHoc: {
          include: {
            ThanhVienHoiDong: {
              where: {
                trang_thai: 1,
              },
              include: {
                GiangVien: true,
              },
            },
          },
        },
      },
      orderBy: {
        thoi_gian_bat_dau: 'asc',
      },
    });
  }

  async taoNhieuLichBaoVe(payload) {
    const lichBaoVeList = payload?.lichBaoVeList;

    if (!Array.isArray(lichBaoVeList) || lichBaoVeList.length === 0) {
      throw new Error('Vui lòng chọn ít nhất một đề tài để xếp lịch');
    }

    const normalizedItems = lichBaoVeList.map((item, index) => this.normalizeScheduleItem(item, index));
    await this.validateBulkScheduleInput(normalizedItems);

    const createdSchedules = await prisma.$transaction(async (tx) => {
      const result = [];

      for (const item of normalizedItems) {
        const baoCaoCuoiCung = await tx.baoCaoCuoiCung.findFirst({
          where: {
            de_tai_id: item.deTaiId,
            nhom_id: item.nhomId,
            du_dieu_kien_bao_ve: true,
          },
          include: {
            NhomNghienCuu: {
              include: {
                ThanhVienNhom: {
                  where: {
                    trang_thai: 1,
                  },
                  include: {
                    SinhVien: true,
                  },
                },
                GiangVien: true,
              },
            },
            DeTaiNghienCuu: true,
          },
        });

        if (!baoCaoCuoiCung) {
          throw new Error(`Đề tài ở dòng ${item.rowLabel} không đủ điều kiện bảo vệ`);
        }

        const existingSchedule = await tx.lichBaoVe.findFirst({
          where: {
            de_tai_id: item.deTaiId,
            nhom_id: item.nhomId,
          },
        });

        if (existingSchedule) {
          throw new Error(`Đề tài ở dòng ${item.rowLabel} đã được xếp lịch trước đó`);
        }

        await this.validateCouncil(tx, item.hoiDongId, item.rowLabel);
        await this.validateScheduleConflicts(tx, item);

        const lichBaoVe = await tx.lichBaoVe.create({
          data: {
            de_tai_id: item.deTaiId,
            nhom_id: item.nhomId,
            hoi_dong_id: item.hoiDongId,
            thoi_gian_bat_dau: item.thoiGianBatDau,
            thoi_gian_ket_thuc: item.thoiGianKetThuc,
            dia_diem: item.diaDiem,
            ghi_chu: item.ghiChu,
            trang_thai: 'DA_XEP_LICH',
          },
        });

        await tx.deTaiNghienCuu.update({
          where: { de_tai_id: item.deTaiId },
          data: {
            trang_thai: 'DA_XEP_LICH',
          },
        });

        await tx.nhomNghienCuu.update({
          where: { nhom_id: item.nhomId },
          data: {
            trang_thai: 'DA_XEP_LICH',
          },
        });

        result.push({
          lichBaoVe,
          baoCaoCuoiCung,
        });
      }

      return result;
    });

    for (const createdItem of createdSchedules) {
      await this.sendDefenseNotifications(createdItem);
    }

    return this.getDanhSachLichBaoVe();
  }

  normalizeScheduleItem(item, index) {
    return {
      rowLabel: index + 1,
      deTaiId: parseInt(item.deTaiId, 10),
      nhomId: parseInt(item.nhomId, 10),
      hoiDongId: parseInt(item.hoiDongId, 10),
      thoiGianBatDau: this.parseDateTimeInput(item.thoiGianBatDau),
      thoiGianKetThuc: this.parseDateTimeInput(item.thoiGianKetThuc),
      diaDiem: item.diaDiem?.trim(),
      ghiChu: item.ghiChu?.trim() || null,
    };
  }

  async validateBulkScheduleInput(items) {
    for (const item of items) {
      if (!item.deTaiId || !item.nhomId || !item.hoiDongId || !item.thoiGianBatDau || !item.thoiGianKetThuc || !item.diaDiem) {
        throw new Error(`Thiếu thông tin lịch ở dòng ${item.rowLabel}. Vui lòng nhập đầy đủ đề tài, hội đồng, thời gian và phòng.`);
      }

      const start = item.thoiGianBatDau;
      const end = item.thoiGianKetThuc;

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
        throw new Error(`Thời gian bảo vệ ở dòng ${item.rowLabel} không hợp lệ`);
      }
    }

    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        if (this.isOverlap(items[i], items[j])) {
          if (items[i].hoiDongId === items[j].hoiDongId) {
            throw new Error(`Trùng lịch hội đồng giữa dòng ${items[i].rowLabel} và dòng ${items[j].rowLabel}`);
          }

          if (items[i].diaDiem === items[j].diaDiem) {
            throw new Error(`Trùng phòng bảo vệ giữa dòng ${items[i].rowLabel} và dòng ${items[j].rowLabel}`);
          }
        }
      }
    }
  }

  async validateCouncil(tx, hoiDongId, rowLabel) {
    const hoiDong = await tx.hoiDongKhoaHoc.findUnique({
      where: { hoi_dong_id: hoiDongId },
      include: {
        ThanhVienHoiDong: {
          where: {
            trang_thai: 1,
          },
        },
      },
    });

    if (!hoiDong || hoiDong.trang_thai !== 1) {
      throw new Error(`Hội đồng ở dòng ${rowLabel} không tồn tại hoặc không hoạt động`);
    }

    const mappedHoiDong = await hoiDongService.getChiTietHoiDong(hoiDongId);
    if (!mappedHoiDong?.hop_le_phan_cong) {
      const missingRoles = mappedHoiDong?.vai_tro_bat_buoc_con_thieu?.join(', ');
      throw new Error(
        missingRoles
          ? `Hội đồng ở dòng ${rowLabel} chưa hợp lệ, thiếu vai trò: ${missingRoles}`
          : `Hội đồng ở dòng ${rowLabel} chưa đủ thành viên hoặc thiếu vai trò bắt buộc`
      );
    }
  }

  async validateScheduleConflicts(tx, item) {
    const overlappingCouncil = await tx.lichBaoVe.findFirst({
      where: {
        hoi_dong_id: item.hoiDongId,
        thoi_gian_bat_dau: {
          lt: item.thoiGianKetThuc,
        },
        thoi_gian_ket_thuc: {
          gt: item.thoiGianBatDau,
        },
      },
    });

    if (overlappingCouncil) {
      throw new Error(`Trùng lịch hội đồng ở dòng ${item.rowLabel}. Vui lòng chọn thời gian hoặc hội đồng khác`);
    }

    const overlappingRoom = await tx.lichBaoVe.findFirst({
      where: {
        dia_diem: item.diaDiem,
        thoi_gian_bat_dau: {
          lt: item.thoiGianKetThuc,
        },
        thoi_gian_ket_thuc: {
          gt: item.thoiGianBatDau,
        },
      },
    });

    if (overlappingRoom) {
      throw new Error(`Trùng phòng bảo vệ ở dòng ${item.rowLabel}. Vui lòng chọn phòng khác`);
    }
  }

  async sendDefenseNotifications(createdItem) {
    const { lichBaoVe, baoCaoCuoiCung } = createdItem;

    const hoiDong = await hoiDongService.getChiTietHoiDong(lichBaoVe.hoi_dong_id);
    const deTaiName = baoCaoCuoiCung.DeTaiNghienCuu.ten_de_tai;
    const defenseTime = new Date(lichBaoVe.thoi_gian_bat_dau).toLocaleString('vi-VN');
    const defenseMessage = `Lịch bảo vệ đề tài "${deTaiName}" được tổ chức vào ${defenseTime} tại ${lichBaoVe.dia_diem}.`;

    for (const member of baoCaoCuoiCung.NhomNghienCuu.ThanhVienNhom) {
      await thongBaoService.taoThongBao({
        tieuDe: 'Lịch bảo vệ đề tài',
        noiDung: defenseMessage,
        nguoiNhanId: member.sinh_vien_id,
        loaiNguoiNhan: 'SINH_VIEN',
        loaiThongBao: 'LICH_BAO_VE',
      });
    }

    if (baoCaoCuoiCung.NhomNghienCuu.giang_vien_huong_dan_id) {
      await thongBaoService.taoThongBao({
        tieuDe: 'Lịch bảo vệ đề tài',
        noiDung: defenseMessage,
        nguoiNhanId: baoCaoCuoiCung.NhomNghienCuu.giang_vien_huong_dan_id,
        loaiNguoiNhan: 'GIANG_VIEN',
        loaiThongBao: 'LICH_BAO_VE',
      });
    }

    for (const member of hoiDong?.ThanhVienHoiDong || []) {
      await thongBaoService.taoThongBao({
        tieuDe: 'Lịch bảo vệ đề tài',
        noiDung: `${defenseMessage} Bạn được phân công với vai trò ${member.vai_tro_trong_hoi_dong}.`,
        nguoiNhanId: member.giang_vien_id,
        loaiNguoiNhan: 'GIANG_VIEN',
        loaiThongBao: 'LICH_BAO_VE',
      });
    }
  }

  isOverlap(firstItem, secondItem) {
    const firstStart = firstItem.thoiGianBatDau;
    const firstEnd = firstItem.thoiGianKetThuc;
    const secondStart = secondItem.thoiGianBatDau;
    const secondEnd = secondItem.thoiGianKetThuc;

    return firstStart < secondEnd && secondStart < firstEnd;
  }

  parseDateTimeInput(value) {
    if (!value || typeof value !== 'string') {
      return new Date('invalid');
    }

    const normalizedValue = value.length === 16 ? `${value}:00` : value;
    return new Date(normalizedValue);
  }
}

module.exports = new LichBaoVeService();
