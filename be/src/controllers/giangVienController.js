// Controller xử lý các request liên quan đến giảng viên
// Thành viên 3: Màn hình chọn giảng viên hướng dẫn

const giangVienService = require('../services/giangVienService');

class GiangVienController {
  // GET /api/lecturers - Lấy danh sách giảng viên
  async getDanhSachGiangVien(req, res) {
    try {
      const { specialization, keyword } = req.query;
      const giangViens = await giangVienService.getDanhSachGiangVien({
        specialization,
        keyword
      });
      res.json(giangViens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/lecturers/:id - Lấy chi tiết giảng viên
  async getChiTietGiangVien(req, res) {
    try {
      const { id } = req.params;
      const giangVien = await giangVienService.getChiTietGiangVien(parseInt(id));
      if (!giangVien) {
        return res.status(404).json({ error: 'Không tìm thấy giảng viên' });
      }
      res.json(giangVien);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/lecturers/:id/quota - Kiểm tra quota hướng dẫn
  async kiemTraQuota(req, res) {
    try {
      const { id } = req.params;
      const quota = await giangVienService.kiemTraQuota(parseInt(id));
      res.json(quota);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/research-groups/:id/advisor - Gán giảng viên hướng dẫn cho nhóm
  async ganGiangVienHuongDan(req, res) {
    try {
      const { id } = req.params;
      const { giangVienId } = req.body;
      const result = await giangVienService.ganGiangVienHuongDan(
        parseInt(id),
        parseInt(giangVienId)
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new GiangVienController();
