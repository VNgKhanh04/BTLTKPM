// Controller xử lý các request liên quan đến hồ sơ đăng ký đề tài
// Thành viên 4: Màn hình nộp hồ sơ đăng ký đề tài

const hoSoDangKyService = require('../services/hoSoDangKyService');

class HoSoDangKyController {
  // POST /api/topic-registrations - Tạo hồ sơ đăng ký đề tài
  async taoHoSoDangKy(req, res) {
    try {
      const hoSoData = req.body;
      const hoSo = await hoSoDangKyService.taoHoSoDangKy(hoSoData);
      res.status(201).json(hoSo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/topic-registrations/:id - Xem chi tiết hồ sơ đăng ký
  async getChiTietHoSo(req, res) {
    try {
      const { id } = req.params;
      const hoSo = await hoSoDangKyService.getChiTietHoSo(parseInt(id));
      if (!hoSo) {
        return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
      }
      res.json(hoSo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/topic-registrations - Xem danh sách hồ sơ
  async getDanhSachHoSo(req, res) {
    try {
      const { studentId, nhomId, trangThai } = req.query;
      const hoSos = await hoSoDangKyService.getDanhSachHoSo({
        studentId: studentId ? parseInt(studentId) : undefined,
        nhomId: nhomId ? parseInt(nhomId) : undefined,
        trangThai
      });
      res.json(hoSos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/topic-registrations/:id - Cập nhật hồ sơ đăng ký
  async capNhatHoSo(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const hoSo = await hoSoDangKyService.capNhatHoSo(parseInt(id), updateData);
      res.json(hoSo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // PATCH /api/topic-registrations/:id/submit - Xác nhận nộp hồ sơ
  async xacNhanNopHoSo(req, res) {
    try {
      const { id } = req.params;
      const hoSo = await hoSoDangKyService.xacNhanNopHoSo(parseInt(id));
      res.json(hoSo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/topic-registrations/:id/timeline - Lấy timeline trạng thái
  async getTimeline(req, res) {
    try {
      const { id } = req.params;
      const timeline = await hoSoDangKyService.getTimeline(parseInt(id));
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new HoSoDangKyController();
