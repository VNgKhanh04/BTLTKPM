// Service xử lý nghiệp vụ liên quan đến lĩnh vực
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

const linhVucRepository = require('../repositories/linhVucRepository');

class LinhVucService {
  async getDanhSachLinhVuc() {
    return await linhVucRepository.findAll();
  }

  async getChiTietLinhVuc(linhVucId) {
    return await linhVucRepository.findById(linhVucId);
  }
}

module.exports = new LinhVucService();
