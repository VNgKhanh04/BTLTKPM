// Routes cho nhóm nghiên cứu
// Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

const express = require('express');
const router = express.Router();
const nhomNghienCuuController = require('../controllers/nhomNghienCuuController');

// POST /api/research-groups - Tạo nhóm nghiên cứu
router.post('/', nhomNghienCuuController.taoNhomNghienCuu);

// GET /api/research-groups/:id - Xem chi tiết nhóm
router.get('/:id', nhomNghienCuuController.getChiTietNhom);

// POST /api/research-groups/:id/members - Thêm thành viên vào nhóm
router.post('/:id/members', nhomNghienCuuController.themThanhVien);

// DELETE /api/research-groups/:id/members/:studentId - Xóa thành viên khỏi nhóm
router.delete('/:id/members/:studentId', nhomNghienCuuController.xoaThanhVien);

// GET /api/research-groups/:id/members - Lấy danh sách thành viên
router.get('/:id/members', nhomNghienCuuController.getDanhSachThanhVien);

// PUT /api/research-groups/:id/advisor - Gán giảng viên hướng dẫn cho nhóm
// Thành viên 3: API gán giảng viên
const giangVienController = require('../controllers/giangVienController');
router.put('/:id/advisor', giangVienController.ganGiangVienHuongDan);

module.exports = router;
