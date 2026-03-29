// Controller xử lý các request liên quan đến thông báo
// Thành viên 5: Kiểm tra điều kiện đăng ký, thông báo và xử lý lỗi

const thongBaoService = require('../services/thongBaoService');

class ThongBaoController {
  // GET /api/notifications - Lấy danh sách thông báo
  async getDanhSachThongBao(req, res) {
    try {
      const { nguoiNhanId, loaiNguoiNhan, daDoc } = req.query;
      const thongBaos = await thongBaoService.getDanhSachThongBao({
        nguoiNhanId: nguoiNhanId ? parseInt(nguoiNhanId) : undefined,
        loaiNguoiNhan,
        daDoc: daDoc === 'true'
      });
      res.json(thongBaos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/notifications - Tạo thông báo hệ thống
  async taoThongBao(req, res) {
    try {
      const thongBaoData = req.body;
      const thongBao = await thongBaoService.taoThongBao(thongBaoData);
      res.status(201).json(thongBao);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // PATCH /api/notifications/:id/read - Đánh dấu đã đọc
  async danhDauDaDoc(req, res) {
    try {
      const { id } = req.params;
      const thongBao = await thongBaoService.danhDauDaDoc(parseInt(id));
      res.json(thongBao);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/notifications/unread-count - Đếm số thông báo chưa đọc
  async demThongBaoChuaDoc(req, res) {
    try {
      const { nguoiNhanId, loaiNguoiNhan } = req.query;
      const count = await thongBaoService.demThongBaoChuaDoc(
        parseInt(nguoiNhanId),
        loaiNguoiNhan
      );
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ThongBaoController();
