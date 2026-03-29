// Controller xử lý các request liên quan đến đề tài
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

const deTaiService = require('../services/deTaiService');

class DeTaiController {
  // GET /api/topics - Lấy danh sách đề tài
  async getDanhSachDeTai(req, res) {
    try {
      const { page = 1, limit = 10, keyword, fieldId, status, namHoc, hocKy } = req.query;
      const result = await deTaiService.getDanhSachDeTai({
        page: parseInt(page),
        limit: parseInt(limit),
        keyword,
        fieldId: fieldId ? parseInt(fieldId) : undefined,
        status,
        namHoc,
        hocKy
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/topics/:id - Lấy chi tiết đề tài
  async getChiTietDeTai(req, res) {
    try {
      const { id } = req.params;
      const deTai = await deTaiService.getChiTietDeTai(parseInt(id));
      if (!deTai) {
        return res.status(404).json({ error: 'Không tìm thấy đề tài' });
      }
      res.json(deTai);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/topics/:id/availability - Kiểm tra đề tài còn khả năng đăng ký
  async kiemTraKhaDangKy(req, res) {
    try {
      const { id } = req.params;
      const result = await deTaiService.kiemTraKhaDangKy(parseInt(id));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DeTaiController();
