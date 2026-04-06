const hoSoDangKyService = require('../services/hoSoDangKyService');

class HoSoDangKyController {
  async taoDangKyChoSinhVien(req, res) {
    try {
      const hoSo = await hoSoDangKyService.taoDangKyChoSinhVien(req.user.nguoiDungId, req.body);
      res.status(201).json(hoSo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async taoHoSoDangKy(req, res) {
    try {
      const hoSo = await hoSoDangKyService.taoHoSoDangKy(req.body);
      res.status(201).json(hoSo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getChiTietHoSo(req, res) {
    try {
      const hoSo = await hoSoDangKyService.getChiTietHoSo(parseInt(req.params.id, 10));
      if (!hoSo) {
        return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
      }
      res.json(hoSo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDanhSachHoSo(req, res) {
    try {
      const { studentId, nhomId, lecturerId, trangThai } = req.query;
      const hoSos = await hoSoDangKyService.getDanhSachHoSo({
        studentId: studentId ? parseInt(studentId, 10) : undefined,
        nhomId: nhomId ? parseInt(nhomId, 10) : undefined,
        lecturerId: lecturerId ? parseInt(lecturerId, 10) : undefined,
        trangThai,
      });
      res.json(hoSos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getHoSoCuaToi(req, res) {
    try {
      const hoSos = await hoSoDangKyService.getDanhSachHoSoCuaSinhVien(
        req.user.nguoiDungId,
        req.query.trangThai
      );
      res.json(hoSos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getHoSoChoGiangVien(req, res) {
    try {
      const hoSos = await hoSoDangKyService.getDanhSachHoSoChoGiangVien(
        req.user.nguoiDungId,
        req.query.trangThai
      );
      res.json(hoSos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async capNhatHoSo(req, res) {
    try {
      const hoSo = await hoSoDangKyService.capNhatHoSo(parseInt(req.params.id, 10), req.body);
      res.json(hoSo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async xacNhanNopHoSo(req, res) {
    try {
      const hoSo = await hoSoDangKyService.xacNhanNopHoSo(parseInt(req.params.id, 10));
      res.json(hoSo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async duyetHoSo(req, res) {
    try {
      const hoSo = await hoSoDangKyService.duyetHoSoDangKy(
        parseInt(req.params.id, 10),
        req.user.nguoiDungId,
        req.body
      );
      res.json(hoSo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTimeline(req, res) {
    try {
      const timeline = await hoSoDangKyService.getTimeline(parseInt(req.params.id, 10));
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new HoSoDangKyController();
