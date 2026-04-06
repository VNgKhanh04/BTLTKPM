const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { tenDangNhap, matKhau } = req.body;
      const result = await authService.login(tenDangNhap, matKhau);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async me(req, res) {
    try {
      const user = await authService.getCurrentUser(req.user.taiKhoanId);
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
