// Controller xử lý các request liên quan đến lĩnh vực nghiên cứu
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

const linhVucService = require('../services/linhVucService');

class LinhVucController {
  // GET /api/fields - Lấy danh sách lĩnh vực
  async getDanhSachLinhVuc(req, res) {
    try {
      const linhVucs = await linhVucService.getDanhSachLinhVuc();
      res.json(linhVucs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/fields/:id - Lấy chi tiết lĩnh vực
  async getChiTietLinhVuc(req, res) {
    try {
      const { id } = req.params;
      const linhVuc = await linhVucService.getChiTietLinhVuc(parseInt(id));
      if (!linhVuc) {
        return res.status(404).json({ error: 'Không tìm thấy lĩnh vực' });
      }
      res.json(linhVuc);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new LinhVucController();
