// Service xử lý nghiệp vụ liên quan đến đề tài
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

const deTaiRepository = require('../repositories/deTaiRepository');

class DeTaiService {
  async getDanhSachDeTai(filters) {
    const { page, limit, keyword, fieldId, status, namHoc, hocKy } = filters;
    
    // Tính toán phân trang
    const skip = (page - 1) * limit;
    
    // Lấy dữ liệu từ repository
    const { deTais, total } = await deTaiRepository.findMany({
      skip,
      take: limit,
      keyword,
      fieldId,
      status,
      namHoc,
      hocKy
    });
    
    return {
      data: deTais,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getChiTietDeTai(deTaiId) {
    return await deTaiRepository.findById(deTaiId);
  }

  async kiemTraKhaDangKy(deTaiId) {
    const deTai = await deTaiRepository.findById(deTaiId);
    
    if (!deTai) {
      throw new Error('Không tìm thấy đề tài');
    }

    // Kiểm tra trạng thái đề tài
    if (deTai.trang_thai !== 'MO_DANG_KY') {
      return {
        available: false,
        reason: 'Đề tài không trong trạng thái mở đăng ký'
      };
    }

    // Kiểm tra số lượng nhóm đã đăng ký
    const soNhomDaDangKy = await deTaiRepository.countRegisteredGroups(deTaiId);
    
    if (soNhomDaDangKy > 0) {
      return {
        available: false,
        reason: 'Đề tài đã có nhóm đăng ký'
      };
    }

    return {
      available: true,
      reason: null
    };
  }
}

module.exports = new DeTaiService();
