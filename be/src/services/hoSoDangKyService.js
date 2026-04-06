const prisma = require('../config/prisma');
const hoSoDangKyRepository = require('../repositories/hoSoDangKyRepository');
const nhomNghienCuuRepository = require('../repositories/nhomNghienCuuRepository');
const deTaiRepository = require('../repositories/deTaiRepository');
const linhVucRepository = require('../repositories/linhVucRepository');
const giangVienRepository = require('../repositories/giangVienRepository');
const sinhVienRepository = require('../repositories/sinhVienRepository');
const thongBaoService = require('./thongBaoService');

class HoSoDangKyService {
  async taoDangKyChoSinhVien(sinhVienId, dangKyData) {
    const {
      tenNhom,
      giangVienId,
      deTaiId,
      lyDoChonDeTai,
      tenDeTaiDeXuat,
      linhVucDeXuatId,
      moTaDeXuat,
      mucTieuDeXuat,
      yeuCauDeXuat,
    } = dangKyData;

    const loaiDangKy = dangKyData.loaiDangKy || dangKyData.loai_dang_ky || 'DE_TAI_CO_SAN';

    const sinhVien = await sinhVienRepository.findById(sinhVienId);
    if (!sinhVien) {
      throw new Error('Không tìm thấy sinh viên');
    }

    if (!giangVienId) {
      throw new Error('Vui lòng chọn giảng viên hướng dẫn');
    }

    if (!['DE_TAI_CO_SAN', 'DE_XUAT_MOI'].includes(loaiDangKy)) {
      throw new Error('Loại đăng ký không hợp lệ');
    }

    const daThamGiaNhom = await nhomNghienCuuRepository.checkSinhVienInGroup(sinhVienId);
    if (daThamGiaNhom) {
      throw new Error('Sinh viên đã có nhóm hoặc hồ sơ đang hoạt động');
    }

    const giangVien = await giangVienRepository.findById(parseInt(giangVienId, 10));
    if (!giangVien) {
      throw new Error('Không tìm thấy giảng viên');
    }

    const soLuongDangHuongDan = await giangVienRepository.countCurrentlySupervising(giangVien.giang_vien_id);
    if (soLuongDangHuongDan >= giangVien.so_luong_huong_dan_toi_da) {
      throw new Error('Giảng viên đã đủ số lượng hướng dẫn');
    }

    let deTai = null;
    let linhVucDeXuat = null;

    if (loaiDangKy === 'DE_TAI_CO_SAN') {
      if (!deTaiId) {
        throw new Error('Vui lòng chọn đề tài có sẵn');
      }

      deTai = await deTaiRepository.findById(parseInt(deTaiId, 10));
      if (!deTai) {
        throw new Error('Không tìm thấy đề tài');
      }

      if (deTai.trang_thai !== 'MO_DANG_KY') {
        throw new Error('Đề tài hiện không thể đăng ký');
      }

      const soNhomDaDangKy = await deTaiRepository.countRegisteredGroups(deTai.de_tai_id);
      if (soNhomDaDangKy > 0) {
        throw new Error('Đề tài này đã có nhóm đăng ký');
      }
    } else {
      if (!tenDeTaiDeXuat || !tenDeTaiDeXuat.trim()) {
        throw new Error('Vui lòng nhập tên đề tài đề xuất');
      }

      if (!linhVucDeXuatId) {
        throw new Error('Vui lòng chọn lĩnh vực đề xuất');
      }

      linhVucDeXuat = await linhVucRepository.findById(parseInt(linhVucDeXuatId, 10));
      if (!linhVucDeXuat) {
        throw new Error('Lĩnh vực đề xuất không tồn tại');
      }
    }

    const maNhom = await this.generateMaNhom();
    const tenNhomThucTe = tenNhom?.trim() || `Nhóm ${sinhVien.ho_ten}`;

    const createdHoSo = await prisma.$transaction(async (tx) => {
      const nhom = await tx.nhomNghienCuu.create({
        data: {
          ma_nhom: maNhom,
          ten_nhom: tenNhomThucTe,
          truong_nhom_id: sinhVienId,
          de_tai_id: deTai?.de_tai_id || null,
          loai_dang_ky: loaiDangKy,
          giang_vien_huong_dan_id: giangVien.giang_vien_id,
          so_luong_thanh_vien: 1,
          trang_thai: 'CHO_DUYET',
        },
      });

      await tx.thanhVienNhom.create({
        data: {
          nhom_id: nhom.nhom_id,
          sinh_vien_id: sinhVienId,
          vai_tro_trong_nhom: 'TRUONG_NHOM',
          trang_thai: 1,
        },
      });

      return tx.hoSoDangKyDeTai.create({
        data: {
          nhom_id: nhom.nhom_id,
          de_tai_id: deTai?.de_tai_id || null,
          loai_dang_ky: loaiDangKy,
          ly_do_chon_de_tai: lyDoChonDeTai,
          ten_de_tai_de_xuat: loaiDangKy === 'DE_XUAT_MOI' ? tenDeTaiDeXuat?.trim() : null,
          linh_vuc_de_xuat_id: linhVucDeXuat?.linh_vuc_id || null,
          mo_ta_de_xuat: loaiDangKy === 'DE_XUAT_MOI' ? moTaDeXuat : null,
          muc_tieu_de_xuat: loaiDangKy === 'DE_XUAT_MOI' ? mucTieuDeXuat : null,
          yeu_cau_de_xuat: loaiDangKy === 'DE_XUAT_MOI' ? yeuCauDeXuat : null,
          trang_thai: 'CHO_PHE_DUYET',
          nguoi_tao_id: sinhVienId,
        },
      });
    });

    const chiTietHoSo = await hoSoDangKyRepository.findById(createdHoSo.ho_so_id);
    const tenDeTaiThongBao = deTai?.ten_de_tai || tenDeTaiDeXuat;

    await thongBaoService.taoThongBao({
      tieuDe: 'Có đăng ký đề tài mới cần duyệt',
      noiDung: `Sinh viên ${sinhVien.ho_ten} đã đăng ký đề tài "${tenDeTaiThongBao}" với bạn.`,
      nguoiNhanId: giangVien.giang_vien_id,
      loaiNguoiNhan: 'GIANG_VIEN',
      loaiThongBao: 'DANG_KY_DE_TAI',
    });

    return chiTietHoSo;
  }

  async taoHoSoDangKy(hoSoData) {
    const {
      nhomId,
      deTaiId,
      lyDoChonDeTai,
      nguoiTaoId,
      tenDeTaiDeXuat,
      linhVucDeXuatId,
      moTaDeXuat,
      mucTieuDeXuat,
      yeuCauDeXuat,
    } = hoSoData;

    const nhom = await nhomNghienCuuRepository.findById(nhomId);
    if (!nhom) {
      throw new Error('Không tìm thấy nhóm');
    }

    const loaiDangKy = hoSoData.loaiDangKy || hoSoData.loai_dang_ky || nhom.loai_dang_ky || 'DE_TAI_CO_SAN';
    let deTai = null;
    let linhVucDeXuat = null;

    if (!['DE_TAI_CO_SAN', 'DE_XUAT_MOI'].includes(loaiDangKy)) {
      throw new Error('Loại đăng ký không hợp lệ');
    }

    if (nhom.loai_dang_ky && nhom.loai_dang_ky !== loaiDangKy) {
      throw new Error('Loại đăng ký của hồ sơ không khớp với nhóm nghiên cứu');
    }

    if (loaiDangKy === 'DE_TAI_CO_SAN') {
      const deTaiDangKyId = deTaiId || nhom.de_tai_id;
      deTai = await deTaiRepository.findById(deTaiDangKyId);
      if (!deTai) {
        throw new Error('Không tìm thấy đề tài');
      }

      if (!nhom.de_tai_id) {
        await nhomNghienCuuRepository.update(nhomId, { de_tai_id: deTai.de_tai_id });
      }
    } else {
      if (!tenDeTaiDeXuat || !tenDeTaiDeXuat.trim()) {
        throw new Error('Vui lòng nhập tên đề tài đề xuất');
      }

      if (!linhVucDeXuatId) {
        throw new Error('Vui lòng chọn lĩnh vực đề xuất');
      }

      linhVucDeXuat = await linhVucRepository.findById(linhVucDeXuatId);
      if (!linhVucDeXuat) {
        throw new Error('Lĩnh vực đề xuất không tồn tại');
      }
    }

    const daDangKy = await hoSoDangKyRepository.checkGroupRegistered(nhomId);
    if (daDangKy) {
      throw new Error('Nhóm đã đăng ký đề tài khác');
    }

    const hoSo = await hoSoDangKyRepository.create({
      nhom_id: nhomId,
      de_tai_id: deTai ? deTai.de_tai_id : null,
      loai_dang_ky: loaiDangKy,
      ly_do_chon_de_tai: lyDoChonDeTai,
      ten_de_tai_de_xuat: tenDeTaiDeXuat,
      linh_vuc_de_xuat_id: linhVucDeXuat ? linhVucDeXuat.linh_vuc_id : null,
      mo_ta_de_xuat: moTaDeXuat,
      muc_tieu_de_xuat: mucTieuDeXuat,
      yeu_cau_de_xuat: yeuCauDeXuat,
      nguoi_tao_id: nguoiTaoId,
      trang_thai: 'CHO_PHE_DUYET',
    });

    const tenDeTaiThongBao = deTai ? deTai.ten_de_tai : tenDeTaiDeXuat;
    await thongBaoService.taoThongBao({
      tieu_de: 'Hồ sơ đăng ký đề tài mới',
      noi_dung: `Nhóm ${nhom.ten_nhom} đã tạo hồ sơ đăng ký đề tài "${tenDeTaiThongBao}"`,
      nguoi_nhan_id: nhom.giang_vien_huong_dan_id || deTai?.giang_vien_huong_dan_id || 1,
      loai_nguoi_nhan: 'GIANG_VIEN',
      loai_thong_bao: 'DANG_KY_DE_TAI',
    });

    return hoSo;
  }

  async getChiTietHoSo(hoSoId) {
    return hoSoDangKyRepository.findById(hoSoId);
  }

  async getDanhSachHoSo(filters) {
    const { studentId, nhomId, lecturerId, trangThai } = filters;
    return hoSoDangKyRepository.findMany({ studentId, nhomId, lecturerId, trangThai });
  }

  async getDanhSachHoSoCuaSinhVien(sinhVienId, trangThai) {
    return hoSoDangKyRepository.findMany({
      studentId: sinhVienId,
      trangThai,
    });
  }

  async getDanhSachHoSoChoGiangVien(giangVienId, trangThai) {
    return hoSoDangKyRepository.findMany({
      lecturerId: giangVienId,
      trangThai,
    });
  }

  async capNhatHoSo(hoSoId, updateData) {
    const hoSo = await hoSoDangKyRepository.findById(hoSoId);
    if (!hoSo) {
      throw new Error('Không tìm thấy hồ sơ');
    }

    if (hoSo.trang_thai === 'DA_DUYET') {
      throw new Error('Không thể cập nhật hồ sơ đã được duyệt');
    }

    return hoSoDangKyRepository.update(hoSoId, updateData);
  }

  async xacNhanNopHoSo(hoSoId) {
    const hoSo = await hoSoDangKyRepository.findById(hoSoId);
    if (!hoSo) {
      throw new Error('Không tìm thấy hồ sơ');
    }

    if (hoSo.trang_thai !== 'CHO_PHE_DUYET') {
      throw new Error('Hồ sơ không ở trạng thái chờ phê duyệt');
    }

    return hoSoDangKyRepository.update(hoSoId, {
      trang_thai: 'DA_NOP',
    });
  }

  async getTimeline(hoSoId) {
    const pheDuyets = await hoSoDangKyRepository.getApprovalHistory(hoSoId);

    return pheDuyets.map((pd) => ({
      thoi_gian: pd.thoi_gian_duyet,
      nguoi_thuc_hien: pd.nguoi_duyet_id,
      loai_nguoi: pd.loai_nguoi_duyet,
      hanh_dong: pd.ket_qua,
      nhan_xet: pd.nhan_xet,
    }));
  }

  async duyetHoSoDangKy(hoSoId, giangVienId, reviewData) {
    const hoSo = await hoSoDangKyRepository.findById(hoSoId);
    if (!hoSo) {
      throw new Error('Không tìm thấy hồ sơ');
    }

    if (hoSo.NhomNghienCuu?.giang_vien_huong_dan_id !== giangVienId) {
      throw new Error('Bạn không có quyền duyệt hồ sơ này');
    }

    if (!['CHO_PHE_DUYET', 'DA_NOP'].includes(hoSo.trang_thai)) {
      throw new Error('Hồ sơ này không còn ở trạng thái chờ duyệt');
    }

    const ketQua = reviewData.ketQua || reviewData.ket_qua;
    const nhanXet = reviewData.nhanXet || reviewData.nhan_xet || null;

    if (!['CHAP_NHAN', 'TU_CHOI'].includes(ketQua)) {
      throw new Error('Kết quả duyệt không hợp lệ');
    }

    const isAccepted = ketQua === 'CHAP_NHAN';

    await prisma.$transaction(async (tx) => {
      let deTaiId = hoSo.de_tai_id;

      if (isAccepted && hoSo.loai_dang_ky === 'DE_XUAT_MOI') {
        const maDeTai = await this.generateMaDeTai(tx);
        const currentTerm = this.getCurrentAcademicTerm();

        const deTaiMoi = await tx.deTaiNghienCuu.create({
          data: {
            ma_de_tai: maDeTai,
            ten_de_tai: hoSo.ten_de_tai_de_xuat,
            linh_vuc_id: hoSo.linh_vuc_de_xuat_id,
            mo_ta: hoSo.mo_ta_de_xuat,
            muc_tieu: hoSo.muc_tieu_de_xuat,
            yeu_cau: hoSo.yeu_cau_de_xuat,
            so_luong_thanh_vien_toi_da: 5,
            giang_vien_huong_dan_id: giangVienId,
            trang_thai: 'DANG_THUC_HIEN',
            nam_hoc: currentTerm.namHoc,
            hoc_ky: currentTerm.hocKy,
          },
        });

        deTaiId = deTaiMoi.de_tai_id;
      }

      await tx.pheDuyetDeTai.create({
        data: {
          ho_so_id: hoSoId,
          nguoi_duyet_id: giangVienId,
          loai_nguoi_duyet: 'GIANG_VIEN',
          ket_qua: isAccepted ? 'DUYET' : 'TU_CHOI',
          nhan_xet: nhanXet,
        },
      });

      await tx.hoSoDangKyDeTai.update({
        where: { ho_so_id: hoSoId },
        data: {
          de_tai_id: deTaiId,
          trang_thai: isAccepted ? 'DA_DUYET' : 'TU_CHOI',
          ghi_chu: nhanXet,
        },
      });

      await tx.nhomNghienCuu.update({
        where: { nhom_id: hoSo.nhom_id },
        data: {
          de_tai_id: deTaiId,
          trang_thai: isAccepted ? 'DA_DUYET' : 'TU_CHOI',
        },
      });

      if (isAccepted && deTaiId) {
        await tx.deTaiNghienCuu.update({
          where: { de_tai_id: deTaiId },
          data: {
            giang_vien_huong_dan_id: giangVienId,
            trang_thai: 'DANG_THUC_HIEN',
          },
        });
      }
    });

    await thongBaoService.taoThongBao({
      tieuDe: isAccepted ? 'Đề tài đã được chấp nhận' : 'Đề tài đã bị từ chối',
      noiDung: isAccepted
        ? `Đề tài đăng ký của nhóm ${hoSo.NhomNghienCuu.ten_nhom} đã được giảng viên chấp nhận.`
        : `Đề tài đăng ký của nhóm ${hoSo.NhomNghienCuu.ten_nhom} đã bị từ chối.${nhanXet ? ` Lý do: ${nhanXet}` : ''}`,
      nguoiNhanId: hoSo.NhomNghienCuu.truong_nhom_id,
      loaiNguoiNhan: 'SINH_VIEN',
      loaiThongBao: 'KET_QUA_DUYET_DE_TAI',
    });

    return hoSoDangKyRepository.findById(hoSoId);
  }

  async generateMaNhom() {
    const year = new Date().getFullYear();
    const count = await nhomNghienCuuRepository.countByYear(year);
    return `NHOM${year}${String(count + 1).padStart(4, '0')}`;
  }

  async generateMaDeTai(tx) {
    const year = new Date().getFullYear();
    const count = await tx.deTaiNghienCuu.count({
      where: {
        ma_de_tai: {
          startsWith: `DT${year}`,
        },
      },
    });

    return `DT${year}${String(count + 1).padStart(4, '0')}`;
  }

  getCurrentAcademicTerm() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const hocKy = month >= 1 && month <= 6 ? 'HK2' : 'HK1';
    const namHoc = month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

    return { hocKy, namHoc };
  }
}

module.exports = new HoSoDangKyService();
