const hoiDongService = require('../services/hoiDongService');

class HoiDongController {
  async getDanhSachHoiDong(req, res) {
    try {
      const hoiDongs = await hoiDongService.getDanhSachHoiDong();
      res.json(hoiDongs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getChiTietHoiDong(req, res) {
    try {
      const hoiDong = await hoiDongService.getChiTietHoiDong(parseInt(req.params.id, 10));
      if (!hoiDong) {
        return res.status(404).json({ error: 'Không tìm thấy hội đồng khoa học' });
      }
      res.json(hoiDong);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new HoiDongController();
