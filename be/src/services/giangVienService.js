// Service xử lý nghiệp vụ liên quan đến giảng viên
// Thành viên 3: Màn hình chọn giảng viên hướng dẫn

const giangVienRepository = require('../repositories/giangVienRepository');
const nhomNghienCuuRepository = require('../repositories/nhomNghienCuuRepository');

class GiangVienService {
  async getDanhSachGiangVien(filters) {
    const { specialization, keyword } = filters;
    return await giangVienRepository.findMany({ specialization, keyword });
  }

  async getChiTietGiangVien(giangVienId) {
    const giangVien = await giangVienRepository.findById(giangVienId);
    
    if (!giangVien) {
      return null;
    }

    // Lấy thêm thông tin số lượng đang hướng dẫn
    const soLuongDangHuongDan = await giangVienRepository.countCurrentlySupervising(giangVienId);
    
    return {
      ...giangVien,
      so_luong_dang_huong_dan: soLuongDangHuongDan
    };
  }

  async kiemTraQuota(giangVienId) {
    const giangVien = await giangVienRepository.findById(giangVienId);
    
    if (!giangVien) {
      throw new Error('Không tìm thấy giảng viên');
    }

    const soLuongDangHuongDan = await giangVienRepository.countCurrentlySupervising(giangVienId);
    const conCho = giangVien.so_luong_huong_dan_toi_da - soLuongDangHuongDan;

    return {
      giang_vien_id: giangVienId,
      ho_ten: giangVien.ho_ten,
      so_luong_toi_da: giangVien.so_luong_huong_dan_toi_da,
      so_luong_dang_huong_dan: soLuongDangHuongDan,
      con_cho: conCho,
      co_the_nhan_them: conCho > 0
    };
  }

  async ganGiangVienHuongDan(nhomId, giangVienId) {
    // Kiểm tra nhóm tồn tại
    const nhom = await nhomNghienCuuRepository.findById(nhomId);
    if (!nhom) {
      throw new Error('Không tìm thấy nhóm');
    }

    // Kiểm tra giảng viên tồn tại
    const giangVien = await giangVienRepository.findById(giangVienId);
    if (!giangVien) {
      throw new Error('Không tìm thấy giảng viên');
    }

    // Kiểm tra quota
    const quota = await this.kiemTraQuota(giangVienId);
    if (!quota.co_the_nhan_them) {
      throw new Error('Giảng viên đã đủ số lượng hướng dẫn');
    }

    // Gán giảng viên hướng dẫn
    return await nhomNghienCuuRepository.assignAdvisor(nhomId, giangVienId);
  }
}

module.exports = new GiangVienService();
