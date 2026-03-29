// Routes cho sinh viên
// Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

const express = require('express');
const router = express.Router();
const sinhVienController = require('../controllers/sinhVienController');

// GET /api/students/search - Tìm sinh viên để thêm vào nhóm
router.get('/search', sinhVienController.timKiemSinhVien);

// GET /api/students/:id - Lấy thông tin sinh viên
router.get('/:id', sinhVienController.getThongTinSinhVien);

// GET /api/students/:id/eligibility - Kiểm tra điều kiện tham gia nhóm
router.get('/:id/eligibility', sinhVienController.kiemTraDieuKien);

module.exports = router;
