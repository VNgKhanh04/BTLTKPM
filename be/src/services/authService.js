const taiKhoanRepository = require('../repositories/taiKhoanRepository');
const sinhVienRepository = require('../repositories/sinhVienRepository');
const giangVienRepository = require('../repositories/giangVienRepository');
const { hashPassword, signToken } = require('../utils/auth');

class AuthService {
  async login(tenDangNhap, matKhau) {
    if (!tenDangNhap || !matKhau) {
      throw new Error('Vui lòng nhập tên đăng nhập và mật khẩu');
    }

    const taiKhoan = await taiKhoanRepository.findByUsername(tenDangNhap.trim());

    if (!taiKhoan) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    if (taiKhoan.trang_thai !== 1) {
      throw new Error('Tài khoản đang bị khóa');
    }

    if (taiKhoan.khoa_den && taiKhoan.khoa_den > new Date()) {
      throw new Error('Tài khoản đang tạm bị khóa');
    }

    const passwordHash = hashPassword(matKhau);
    if (taiKhoan.mat_khau_hash !== passwordHash) {
      await taiKhoanRepository.update(taiKhoan.tai_khoan_id, {
        so_lan_dang_nhap_sai: (taiKhoan.so_lan_dang_nhap_sai || 0) + 1,
      });

      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const updatedTaiKhoan = await taiKhoanRepository.update(taiKhoan.tai_khoan_id, {
      so_lan_dang_nhap_sai: 0,
      lan_dang_nhap_cuoi: new Date(),
    });

    return this.buildAuthResponse(updatedTaiKhoan);
  }

  async getCurrentUser(taiKhoanId) {
    const taiKhoan = await taiKhoanRepository.findById(taiKhoanId);
    if (!taiKhoan) {
      throw new Error('Không tìm thấy tài khoản');
    }

    const profile = await this.getProfileForAccount(taiKhoan);

    return {
      taiKhoanId: taiKhoan.tai_khoan_id,
      tenDangNhap: taiKhoan.ten_dang_nhap,
      vaiTro: taiKhoan.VaiTro?.ten_vai_tro || taiKhoan.loai_nguoi_dung,
      loaiNguoiDung: taiKhoan.loai_nguoi_dung,
      nguoiDungId: taiKhoan.nguoi_dung_id,
      profile,
    };
  }

  async buildAuthResponse(taiKhoan) {
    const user = await this.getCurrentUser(taiKhoan.tai_khoan_id);
    const token = signToken({
      taiKhoanId: taiKhoan.tai_khoan_id,
      tenDangNhap: taiKhoan.ten_dang_nhap,
      vaiTro: user.vaiTro,
      loaiNguoiDung: taiKhoan.loai_nguoi_dung,
      nguoiDungId: taiKhoan.nguoi_dung_id,
    });

    return {
      token,
      user,
    };
  }

  async getProfileForAccount(taiKhoan) {
    if (taiKhoan.loai_nguoi_dung === 'SINH_VIEN') {
      return sinhVienRepository.findById(taiKhoan.nguoi_dung_id);
    }

    if (taiKhoan.loai_nguoi_dung === 'GIANG_VIEN') {
      return giangVienRepository.findById(taiKhoan.nguoi_dung_id);
    }

    return null;
  }
}

module.exports = new AuthService();
