// Controller xử lý validation hồ sơ đăng ký
// Thành viên 5: Kiểm tra điều kiện đăng ký, thông báo và xử lý lỗi

const validationService = require('../services/validationService');

class ValidationController {
  // POST /api/topic-registrations/validate - Kiểm tra tính hợp lệ của hồ sơ
  async validateHoSoDangKy(req, res) {
    try {
      const hoSoData = req.body;
      const result = await validationService.validateHoSoDangKy(hoSoData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/topic-registrations/:id/errors - Lấy danh sách lỗi
  async getDanhSachLoi(req, res) {
    try {
      const { id } = req.params;
      const errors = await validationService.getDanhSachLoi(parseInt(id));
      res.json(errors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/topics/:id/check-duplicate - Kiểm tra trùng lặp đề tài
  async kiemTraTrungDeTai(req, res) {
    try {
      const { id } = req.params;
      const { nhomId } = req.body;
      const result = await validationService.kiemTraTrungDeTai(
        parseInt(id),
        nhomId ? parseInt(nhomId) : undefined
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ValidationController();
