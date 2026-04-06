const lichBaoVeService = require('../services/lichBaoVeService');

class LichBaoVeController {
  async getDeTaiDuDieuKien(req, res) {
    try {
      const result = await lichBaoVeService.getDanhSachDeTaiDuDieuKien(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDanhSachLichBaoVe(req, res) {
    try {
      const result = await lichBaoVeService.getDanhSachLichBaoVe(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async taoNhieuLichBaoVe(req, res) {
    try {
      const result = await lichBaoVeService.taoNhieuLichBaoVe(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new LichBaoVeController();
