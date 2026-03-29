// Routes cho giảng viên
// Thành viên 3: Màn hình chọn giảng viên hướng dẫn

const express = require('express');
const router = express.Router();
const giangVienController = require('../controllers/giangVienController');

// GET /api/lecturers - Lấy danh sách giảng viên (có thể filter)
router.get('/', giangVienController.getDanhSachGiangVien);

// GET /api/lecturers/:id - Lấy chi tiết giảng viên
router.get('/:id', giangVienController.getChiTietGiangVien);

// GET /api/lecturers/:id/quota - Kiểm tra quota hướng dẫn
router.get('/:id/quota', giangVienController.kiemTraQuota);

module.exports = router;
