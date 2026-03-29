// Routes cho hồ sơ đăng ký đề tài
// Thành viên 4: Màn hình nộp hồ sơ đăng ký đề tài

const express = require('express');
const router = express.Router();
const hoSoDangKyController = require('../controllers/hoSoDangKyController');

// POST /api/topic-registrations - Tạo hồ sơ đăng ký
router.post('/', hoSoDangKyController.taoHoSoDangKy);

// GET /api/topic-registrations - Lấy danh sách hồ sơ
router.get('/', hoSoDangKyController.getDanhSachHoSo);

// GET /api/topic-registrations/:id - Xem chi tiết hồ sơ
router.get('/:id', hoSoDangKyController.getChiTietHoSo);

// PUT /api/topic-registrations/:id - Cập nhật hồ sơ
router.put('/:id', hoSoDangKyController.capNhatHoSo);

// PATCH /api/topic-registrations/:id/submit - Xác nhận nộp hồ sơ
router.patch('/:id/submit', hoSoDangKyController.xacNhanNopHoSo);

// GET /api/topic-registrations/:id/timeline - Lấy timeline
router.get('/:id/timeline', hoSoDangKyController.getTimeline);

module.exports = router;
