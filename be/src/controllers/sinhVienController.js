// Controller xử lý các request liên quan đến sinh viên
// Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

const sinhVienService = require('../services/sinhVienService');

class SinhVienController {
  // GET /api/students/search - Tìm sinh viên để thêm vào nhóm
  async timKiemSinhVien(req, res) {
    try {
      const { keyword } = req.query;
      const sinhViens = await sinhVienService.timKiemSinhVien(keyword);
      res.json(sinhViens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/students/:id - Lấy thông tin sinh viên
  async getThongTinSinhVien(req, res) {
    try {
      const { id } = req.params;
      const sinhVien = await sinhVienService.getThongTinSinhVien(parseInt(id));
      if (!sinhVien) {
        return res.status(404).json({ error: 'Không tìm thấy sinh viên' });
      }
      res.json(sinhVien);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/students/:id/eligibility - Kiểm tra điều kiện tham gia nhóm
  async kiemTraDieuKien(req, res) {
    try {
      const { id } = req.params;
      const result = await sinhVienService.kiemTraDieuKienThamGia(parseInt(id));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SinhVienController();
