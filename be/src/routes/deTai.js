// Routes cho đề tài nghiên cứu
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

const express = require('express');
const router = express.Router();
const deTaiController = require('../controllers/deTaiController');

// GET /api/topics - Lấy danh sách đề tài (có phân trang, tìm kiếm, lọc)
router.get('/', deTaiController.getDanhSachDeTai);

// GET /api/topics/:id - Lấy chi tiết đề tài
router.get('/:id', deTaiController.getChiTietDeTai);

// GET /api/topics/:id/availability - Kiểm tra đề tài còn khả năng đăng ký
router.get('/:id/availability', deTaiController.kiemTraKhaDangKy);

module.exports = router;
