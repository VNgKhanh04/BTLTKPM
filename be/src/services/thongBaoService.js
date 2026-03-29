// Service xử lý nghiệp vụ liên quan đến thông báo
// Thành viên 5: Kiểm tra điều kiện đăng ký, thông báo và xử lý lỗi

const thongBaoRepository = require('../repositories/thongBaoRepository');

class ThongBaoService {
  async getDanhSachThongBao(filters) {
    const { nguoiNhanId, loaiNguoiNhan, daDoc } = filters;
    return await thongBaoRepository.findMany({ nguoiNhanId, loaiNguoiNhan, daDoc });
  }

  async taoThongBao(thongBaoData) {
    // Support both camelCase and snake_case
    const tieu_de = thongBaoData.tieu_de || thongBaoData.tieuDe;
    const noi_dung = thongBaoData.noi_dung || thongBaoData.noiDung;
    const nguoi_nhan_id = thongBaoData.nguoi_nhan_id || thongBaoData.nguoiNhanId;
    const loai_nguoi_nhan = thongBaoData.loai_nguoi_nhan || thongBaoData.loaiNguoiNhan;
    const loai_thong_bao = thongBaoData.loai_thong_bao || thongBaoData.loaiThongBao || 'THONG_BAO_CHUNG';
    const duong_dan = thongBaoData.duong_dan || thongBaoData.duongDan;

    // Validate dữ liệu
    if (!tieu_de || !noi_dung || !nguoi_nhan_id || !loai_nguoi_nhan) {
      throw new Error('Thiếu thông tin bắt buộc: tieuDe, noiDung, nguoiNhanId, loaiNguoiNhan');
    }

    return await thongBaoRepository.create({
      tieu_de,
      noi_dung,
      nguoi_nhan_id,
      loai_nguoi_nhan,
      loai_thong_bao,
      duong_dan,
      da_doc: false
    });
  }

  async danhDauDaDoc(thongBaoId) {
    const thongBao = await thongBaoRepository.findById(thongBaoId);
    
    if (!thongBao) {
      throw new Error('Không tìm thấy thông báo');
    }

    return await thongBaoRepository.update(thongBaoId, { da_doc: true });
  }

  async demThongBaoChuaDoc(nguoiNhanId, loaiNguoiNhan) {
    return await thongBaoRepository.countUnread(nguoiNhanId, loaiNguoiNhan);
  }

  // Các hàm tiện ích để gửi thông báo cho các sự kiện cụ thể
  async guiThongBaoDangKyThanhCong(nhomId, deTaiId) {
    // TODO: Implement logic gửi thông báo đăng ký thành công
  }

  async guiThongBaoPheDuyet(hoSoId, ketQua, nguoiNhanId) {
    // TODO: Implement logic gửi thông báo phê duyệt
  }
}

module.exports = new ThongBaoService();
