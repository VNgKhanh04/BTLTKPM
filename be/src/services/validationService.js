// Service xử lý validation và kiểm tra điều kiện
// Thành viên 5: Kiểm tra điều kiện đăng ký, thông báo và xử lý lỗi

const hoSoDangKyRepository = require('../repositories/hoSoDangKyRepository');
const nhomNghienCuuRepository = require('../repositories/nhomNghienCuuRepository');
const deTaiRepository = require('../repositories/deTaiRepository');
const giangVienRepository = require('../repositories/giangVienRepository');
const linhVucRepository = require('../repositories/linhVucRepository');

class ValidationService {
  async validateHoSoDangKy(hoSoData) {
    const errors = [];
    const {
      nhomId,
      deTaiId,
      tenDeTaiDeXuat,
      linhVucDeXuatId,
      moTaDeXuat,
      mucTieuDeXuat,
      yeuCauDeXuat
    } = hoSoData;
    const loaiDangKyInput = hoSoData.loaiDangKy || hoSoData.loai_dang_ky;
    let nhom = null;
    let loaiDangKy = loaiDangKyInput;

    if (loaiDangKy && !['DE_TAI_CO_SAN', 'DE_XUAT_MOI'].includes(loaiDangKy)) {
      errors.push({ field: 'loaiDangKy', message: 'Loại đăng ký không hợp lệ' });
    }

    // Kiểm tra nhóm
    if (!nhomId) {
      errors.push({ field: 'nhomId', message: 'Vui lòng chọn nhóm nghiên cứu' });
    } else {
      nhom = await nhomNghienCuuRepository.findById(nhomId);
      if (!nhom) {
        errors.push({ field: 'nhomId', message: 'Nhóm nghiên cứu không tồn tại' });
      } else {
        loaiDangKy = loaiDangKy || nhom.loai_dang_ky || 'DE_TAI_CO_SAN';

        // Kiểm tra nhóm đã có giảng viên hướng dẫn chưa
        if (!nhom.giang_vien_huong_dan_id) {
          errors.push({ field: 'nhomId', message: 'Nhóm chưa có giảng viên hướng dẫn' });
        }

        // Kiểm tra số lượng thành viên
        if (nhom.so_luong_thanh_vien < 1) {
          errors.push({ field: 'nhomId', message: 'Nhóm phải có ít nhất 1 thành viên' });
        }

        if (loaiDangKy && nhom.loai_dang_ky && nhom.loai_dang_ky !== loaiDangKy) {
          errors.push({ field: 'loaiDangKy', message: 'Loại đăng ký không khớp với nhóm nghiên cứu' });
        }
      }
    }

    loaiDangKy = loaiDangKy || 'DE_TAI_CO_SAN';

    if (loaiDangKy === 'DE_TAI_CO_SAN') {
      const deTaiDangKyId = deTaiId || nhom?.de_tai_id;

      if (!deTaiDangKyId) {
        errors.push({ field: 'deTaiId', message: 'Vui lòng chọn đề tài' });
      } else {
        const deTai = await deTaiRepository.findById(deTaiDangKyId);
        if (!deTai) {
          errors.push({ field: 'deTaiId', message: 'Đề tài không tồn tại' });
        } else {
          if (deTai.trang_thai !== 'MO_DANG_KY') {
            errors.push({ field: 'deTaiId', message: 'Đề tài không trong trạng thái mở đăng ký' });
          }

          const daDangKy = await this.kiemTraTrungDeTai(deTaiDangKyId, nhomId);
          if (!daDangKy.available) {
            errors.push({ field: 'deTaiId', message: daDangKy.reason });
          }
        }
      }
    }

    if (loaiDangKy === 'DE_XUAT_MOI') {
      if (!tenDeTaiDeXuat || !tenDeTaiDeXuat.trim()) {
        errors.push({ field: 'tenDeTaiDeXuat', message: 'Vui lòng nhập tên đề tài đề xuất' });
      }

      if (!linhVucDeXuatId) {
        errors.push({ field: 'linhVucDeXuatId', message: 'Vui lòng chọn lĩnh vực đề xuất' });
      } else {
        const linhVuc = await linhVucRepository.findById(linhVucDeXuatId);
        if (!linhVuc) {
          errors.push({ field: 'linhVucDeXuatId', message: 'Lĩnh vực đề xuất không tồn tại' });
        }
      }

      if (!moTaDeXuat && !mucTieuDeXuat && !yeuCauDeXuat) {
        errors.push({
          field: 'moTaDeXuat',
          message: 'Vui lòng cung cấp ít nhất một nội dung mô tả, mục tiêu hoặc yêu cầu cho đề tài đề xuất'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async kiemTraTrungDeTai(deTaiId, nhomId) {
    // Kiểm tra đề tài đã có nhóm khác đăng ký chưa
    const hoSos = await hoSoDangKyRepository.findByTopic(deTaiId);
    
    // Lọc ra các hồ sơ không phải của nhóm hiện tại
    const hoSosKhac = hoSos.filter(hs => hs.nhom_id !== nhomId);
    
    if (hoSosKhac.length > 0) {
      return {
        available: false,
        reason: 'Đề tài đã có nhóm khác đăng ký'
      };
    }

    return {
      available: true,
      reason: null
    };
  }

  async getDanhSachLoi(hoSoId) {
    const hoSo = await hoSoDangKyRepository.findById(hoSoId);
    
    if (!hoSo) {
      throw new Error('Không tìm thấy hồ sơ');
    }

    // Nếu hồ sơ bị từ chối, lấy lý do từ bảng phê duyệt
    if (hoSo.trang_thai === 'TU_CHOI') {
      const pheDuyets = await hoSoDangKyRepository.getApprovalHistory(hoSoId);
      const tuChoi = pheDuyets.filter(pd => pd.ket_qua === 'TU_CHOI');
      
      return tuChoi.map(tc => ({
        nguoi_nhan_xet: tc.nguoi_duyet_id,
        loai_nguoi: tc.loai_nguoi_duyet,
        nhan_xet: tc.nhan_xet,
        thoi_gian: tc.thoi_gian_duyet
      }));
    }

    return [];
  }
}

module.exports = new ValidationService();
