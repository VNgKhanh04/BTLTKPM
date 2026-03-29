// Controller xử lý các request liên quan đến nhóm nghiên cứu
// Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

const nhomNghienCuuService = require('../services/nhomNghienCuuService');

class NhomNghienCuuController {
  // POST /api/research-groups - Tạo nhóm nghiên cứu
  async taoNhomNghienCuu(req, res) {
    try {
      const nhomData = req.body;
      const nhom = await nhomNghienCuuService.taoNhomNghienCuu(nhomData);
      res.status(201).json(nhom);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/research-groups/:id - Xem chi tiết nhóm
  async getChiTietNhom(req, res) {
    try {
      const { id } = req.params;
      const nhom = await nhomNghienCuuService.getChiTietNhom(parseInt(id));
      if (!nhom) {
        return res.status(404).json({ error: 'Không tìm thấy nhóm' });
      }
      res.json(nhom);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/research-groups/:id/members - Thêm thành viên vào nhóm
  async themThanhVien(req, res) {
    try {
      const { id } = req.params;
      const { sinhVienId, vaiTro } = req.body;
      const result = await nhomNghienCuuService.themThanhVien(
        parseInt(id),
        parseInt(sinhVienId),
        vaiTro
      );
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /api/research-groups/:id/members/:studentId - Xóa thành viên khỏi nhóm
  async xoaThanhVien(req, res) {
    try {
      const { id, studentId } = req.params;
      await nhomNghienCuuService.xoaThanhVien(parseInt(id), parseInt(studentId));
      res.json({ message: 'Đã xóa thành viên khỏi nhóm' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/research-groups/:id/members - Lấy danh sách thành viên
  async getDanhSachThanhVien(req, res) {
    try {
      const { id } = req.params;
      const members = await nhomNghienCuuService.getDanhSachThanhVien(parseInt(id));
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new NhomNghienCuuController();
