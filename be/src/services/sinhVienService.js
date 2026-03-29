// Service xử lý nghiệp vụ liên quan đến sinh viên
// Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

const sinhVienRepository = require('../repositories/sinhVienRepository');
const nhomNghienCuuRepository = require('../repositories/nhomNghienCuuRepository');

class SinhVienService {
  async timKiemSinhVien(keyword) {
    if (!keyword || keyword.trim() === '') {
      return [];
    }
    return await sinhVienRepository.search(keyword);
  }

  async getThongTinSinhVien(sinhVienId) {
    return await sinhVienRepository.findById(sinhVienId);
  }

  async kiemTraDieuKienThamGia(sinhVienId) {
    const sinhVien = await sinhVienRepository.findById(sinhVienId);
    
    if (!sinhVien) {
      return {
        eligible: false,
        reason: 'Không tìm thấy sinh viên'
      };
    }

    // Kiểm tra trạng thái sinh viên
    if (sinhVien.trang_thai !== 1) {
      return {
        eligible: false,
        reason: 'Sinh viên không ở trạng thái hoạt động'
      };
    }

    // Kiểm tra sinh viên đã tham gia nhóm nào chưa
    const daThamGiaNhom = await nhomNghienCuuRepository.checkSinhVienInGroup(sinhVienId);
    if (daThamGiaNhom) {
      return {
        eligible: false,
        reason: 'Sinh viên đã tham gia nhóm khác'
      };
    }

    return {
      eligible: true,
      reason: null
    };
  }
}

module.exports = new SinhVienService();
