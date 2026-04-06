const hoiDongRepository = require('../repositories/hoiDongRepository');

const REQUIRED_ROLES = ['CHU_TICH', 'THU_KY', 'PHAN_BIEN'];

class HoiDongService {
  async getDanhSachHoiDong() {
    const hoiDongs = await hoiDongRepository.findMany();
    return hoiDongs.map((hoiDong) => this.mapHoiDong(hoiDong));
  }

  async getChiTietHoiDong(hoiDongId) {
    const hoiDong = await hoiDongRepository.findById(hoiDongId);
    if (!hoiDong) {
      return null;
    }

    return this.mapHoiDong(hoiDong);
  }

  mapHoiDong(hoiDong) {
    const activeMembers = hoiDong.ThanhVienHoiDong || [];
    const roles = activeMembers.map((member) => member.vai_tro_trong_hoi_dong);
    const missingRoles = REQUIRED_ROLES.filter((role) => !roles.includes(role));
    const isValid = activeMembers.length >= 3 && missingRoles.length === 0;

    return {
      ...hoiDong,
      hop_le_phan_cong: isValid,
      so_luong_thanh_vien_hien_tai: activeMembers.length,
      vai_tro_bat_buoc_con_thieu: missingRoles,
    };
  }
}

module.exports = new HoiDongService();
