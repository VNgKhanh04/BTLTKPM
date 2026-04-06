const express = require('express');
const hoSoDangKyController = require('../controllers/hoSoDangKyController');
const { authenticate, requireRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/', hoSoDangKyController.taoHoSoDangKy);
router.post(
  '/student',
  authenticate,
  requireRoles('SINH_VIEN'),
  hoSoDangKyController.taoDangKyChoSinhVien
);

router.get('/', hoSoDangKyController.getDanhSachHoSo);
router.get(
  '/my',
  authenticate,
  requireRoles('SINH_VIEN'),
  hoSoDangKyController.getHoSoCuaToi
);
router.get(
  '/assigned-to-me',
  authenticate,
  requireRoles('GIANG_VIEN'),
  hoSoDangKyController.getHoSoChoGiangVien
);

router.get('/:id', hoSoDangKyController.getChiTietHoSo);
router.put('/:id', hoSoDangKyController.capNhatHoSo);
router.patch('/:id/submit', hoSoDangKyController.xacNhanNopHoSo);
router.patch(
  '/:id/review',
  authenticate,
  requireRoles('GIANG_VIEN'),
  hoSoDangKyController.duyetHoSo
);
router.get('/:id/timeline', hoSoDangKyController.getTimeline);

module.exports = router;
