// Routes cho thông báo
// Thành viên 5: Kiểm tra điều kiện đăng ký, thông báo và xử lý lỗi

const express = require('express');
const router = express.Router();
const thongBaoController = require('../controllers/thongBaoController');

// GET /api/notifications - Lấy danh sách thông báo
router.get('/', thongBaoController.getDanhSachThongBao);

// POST /api/notifications - Tạo thông báo
router.post('/', thongBaoController.taoThongBao);

// PATCH /api/notifications/:id/read - Đánh dấu đã đọc
router.patch('/:id/read', thongBaoController.danhDauDaDoc);

// GET /api/notifications/unread-count - Đếm số thông báo chưa đọc
router.get('/unread-count', thongBaoController.demThongBaoChuaDoc);

module.exports = router;
