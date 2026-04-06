const express = require('express');
const hoiDongController = require('../controllers/hoiDongController');
const { authenticate, requireRoles } = require('../middlewares/auth');

const router = express.Router();

router.get(
  '/',
  authenticate,
  requireRoles('CAN_BO_QUAN_LY', 'QUAN_TRI_HE_THONG'),
  hoiDongController.getDanhSachHoiDong
);

router.get(
  '/:id',
  authenticate,
  requireRoles('CAN_BO_QUAN_LY', 'QUAN_TRI_HE_THONG'),
  hoiDongController.getChiTietHoiDong
);

module.exports = router;
