const express = require('express');
const lichBaoVeController = require('../controllers/lichBaoVeController');
const { authenticate, requireRoles } = require('../middlewares/auth');

const router = express.Router();

router.get(
  '/eligible-topics',
  authenticate,
  requireRoles('CAN_BO_QUAN_LY', 'QUAN_TRI_HE_THONG'),
  lichBaoVeController.getDeTaiDuDieuKien
);

router.get(
  '/',
  authenticate,
  requireRoles('CAN_BO_QUAN_LY', 'QUAN_TRI_HE_THONG'),
  lichBaoVeController.getDanhSachLichBaoVe
);

router.post(
  '/bulk',
  authenticate,
  requireRoles('CAN_BO_QUAN_LY', 'QUAN_TRI_HE_THONG'),
  lichBaoVeController.taoNhieuLichBaoVe
);

module.exports = router;
