// Routes cho validation
// Thành viên 5: Kiểm tra điều kiện đăng ký, thông báo và xử lý lỗi

const express = require('express');
const router = express.Router();
const validationController = require('../controllers/validationController');

// POST /api/validation/topic-registration - Validate hồ sơ đăng ký
router.post('/topic-registration', validationController.validateHoSoDangKy);

// GET /api/validation/registration/:id/errors - Lấy danh sách lỗi
router.get('/registration/:id/errors', validationController.getDanhSachLoi);

// POST /api/validation/topic/:id/check-duplicate - Kiểm tra trùng đề tài
router.post('/topic/:id/check-duplicate', validationController.kiemTraTrungDeTai);

module.exports = router;
