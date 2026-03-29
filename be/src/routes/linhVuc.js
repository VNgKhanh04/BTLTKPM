// Routes cho lĩnh vực nghiên cứu
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

const express = require('express');
const router = express.Router();
const linhVucController = require('../controllers/linhVucController');

// GET /api/fields - Lấy danh sách lĩnh vực
router.get('/', linhVucController.getDanhSachLinhVuc);

// GET /api/fields/:id - Lấy chi tiết lĩnh vực
router.get('/:id', linhVucController.getChiTietLinhVuc);

module.exports = router;
