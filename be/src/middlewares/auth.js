const authService = require('../services/authService');
const { verifyToken } = require('../utils/auth');

async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ')
      ? authorization.slice(7)
      : req.headers['x-auth-token'];

    if (!token) {
      return res.status(401).json({ error: 'Bạn cần đăng nhập để tiếp tục' });
    }

    const payload = verifyToken(token);
    const user = await authService.getCurrentUser(payload.taiKhoanId);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

function requireRoles(...roles) {
  return (req, res, next) => {
    const userRole = req.user?.vaiTro || req.user?.loaiNguoiDung;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: 'Bạn không có quyền thực hiện thao tác này' });
    }

    next();
  };
}

module.exports = {
  authenticate,
  requireRoles,
};
