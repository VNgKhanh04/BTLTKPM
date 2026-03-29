// Service xử lý nghiệp vụ liên quan đến hồ sơ đăng ký
// Thành viên 4: Màn hình nộp hồ sơ đăng ký đề tài

const hoSoDangKyRepository = require('../repositories/hoSoDangKyRepository');
const nhomNghienCuuRepository = require('../repositories/nhomNghienCuuRepository');
const deTaiRepository = require('../repositories/deTaiRepository');
const linhVucRepository = require('../repositories/linhVucRepository');
const thongBaoService = require('./thongBaoService');

class HoSoDangKyService {
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
      yeuCauDeXuat
    } = hoSoData;

    // Kiểm tra nhóm tồn tại
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

    // Kiểm tra đề tài tồn tại khi đăng ký đề tài có sẵn
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

    // Kiểm tra nhóm đã đăng ký đề tài nào chưa
    const daDangKy = await hoSoDangKyRepository.checkGroupRegistered(nhomId);
    if (daDangKy) {
      throw new Error('Nhóm đã đăng ký đề tài khác');
    }

    // Tạo hồ sơ
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
      trang_thai: 'CHO_PHE_DUYET'
    });

    // Gửi thông báo
    const tenDeTaiThongBao = deTai ? deTai.ten_de_tai : tenDeTaiDeXuat;
    await thongBaoService.taoThongBao({
      tieu_de: 'Hồ sơ đăng ký đề tài mới',
      noi_dung: `Nhóm ${nhom.ten_nhom} đã tạo hồ sơ đăng ký đề tài "${tenDeTaiThongBao}"`,
      nguoi_nhan_id: nhom.giang_vien_huong_dan_id || deTai?.giang_vien_huong_dan_id || 1,
      loai_nguoi_nhan: 'GIANG_VIEN',
      loai_thong_bao: 'DANG_KY_DE_TAI'
    });

    return hoSo;
  }

  async getChiTietHoSo(hoSoId) {
    return await hoSoDangKyRepository.findById(hoSoId);
  }

  async getDanhSachHoSo(filters) {
    const { studentId, nhomId, trangThai } = filters;
    return await hoSoDangKyRepository.findMany({ studentId, nhomId, trangThai });
  }

  async capNhatHoSo(hoSoId, updateData) {
    // Kiểm tra hồ sơ tồn tại
    const hoSo = await hoSoDangKyRepository.findById(hoSoId);
    if (!hoSo) {
      throw new Error('Không tìm thấy hồ sơ');
    }

    // Chỉ cho phép cập nhật khi chưa được duyệt
    if (hoSo.trang_thai === 'DA_DUYET') {
      throw new Error('Không thể cập nhật hồ sơ đã được duyệt');
    }

    return await hoSoDangKyRepository.update(hoSoId, updateData);
  }

  async xacNhanNopHoSo(hoSoId) {
    // Kiểm tra hồ sơ tồn tại
    const hoSo = await hoSoDangKyRepository.findById(hoSoId);
    if (!hoSo) {
      throw new Error('Không tìm thấy hồ sơ');
    }

    // Kiểm tra trạng thái
    if (hoSo.trang_thai !== 'CHO_PHE_DUYET') {
      throw new Error('Hồ sơ không ở trạng thái chờ phê duyệt');
    }

    // Cập nhật trạng thái
    return await hoSoDangKyRepository.update(hoSoId, {
      trang_thai: 'DA_NOP'
    });
  }

  async getTimeline(hoSoId) {
    // Lấy lịch sử phê duyệt
    const pheDuyets = await hoSoDangKyRepository.getApprovalHistory(hoSoId);
    
    // Tạo timeline
    const timeline = pheDuyets.map(pd => ({
      thoi_gian: pd.thoi_gian_duyet,
      nguoi_thuc_hien: pd.nguoi_duyet_id,
      loai_nguoi: pd.loai_nguoi_duyet,
      hanh_dong: pd.ket_qua,
      nhan_xet: pd.nhan_xet
    }));

    return timeline;
  }
}

module.exports = new HoSoDangKyService();
