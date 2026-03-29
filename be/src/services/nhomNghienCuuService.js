// Service xử lý nghiệp vụ liên quan đến nhóm nghiên cứu
// Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

const nhomNghienCuuRepository = require('../repositories/nhomNghienCuuRepository');
const deTaiRepository = require('../repositories/deTaiRepository');
const sinhVienRepository = require('../repositories/sinhVienRepository');

class NhomNghienCuuService {
  async taoNhomNghienCuu(nhomData) {
    const { tenNhom, truongNhomId, deTaiId } = nhomData;
    const loaiDangKy = nhomData.loaiDangKy || nhomData.loai_dang_ky || 'DE_TAI_CO_SAN';
    let deTai = null;

    // Kiểm tra sinh viên tồn tại
    const sinhVien = await sinhVienRepository.findById(truongNhomId);
    if (!sinhVien) {
      throw new Error('Không tìm thấy sinh viên');
    }

    if (!['DE_TAI_CO_SAN', 'DE_XUAT_MOI'].includes(loaiDangKy)) {
      throw new Error('Loại đăng ký không hợp lệ');
    }

    // Kiểm tra đề tài tồn tại khi đăng ký đề tài có sẵn
    if (loaiDangKy === 'DE_TAI_CO_SAN') {
      if (!deTaiId) {
        throw new Error('Vui lòng chọn đề tài');
      }

      deTai = await deTaiRepository.findById(deTaiId);
      if (!deTai) {
        throw new Error('Không tìm thấy đề tài');
      }
    }

    // Kiểm tra sinh viên đã có nhóm chưa
    const daThamGiaNhom = await nhomNghienCuuRepository.checkSinhVienInGroup(truongNhomId);
    if (daThamGiaNhom) {
      throw new Error('Sinh viên đã tham gia nhóm khác');
    }

    // Tạo mã nhóm tự động
    const maNhom = await this.generateMaNhom();

    // Tạo nhóm
    const nhom = await nhomNghienCuuRepository.create({
      ma_nhom: maNhom,
      ten_nhom: tenNhom,
      truong_nhom_id: truongNhomId,
      de_tai_id: deTai ? deTaiId : null,
      loai_dang_ky: loaiDangKy,
      so_luong_thanh_vien: 1,
      trang_thai: 'CHO_DUYET'
    });

    // Thêm trưởng nhóm vào danh sách thành viên
    await nhomNghienCuuRepository.addMember(nhom.nhom_id, truongNhomId, 'TRUONG_NHOM');

    return nhom;
  }

  async getChiTietNhom(nhomId) {
    return await nhomNghienCuuRepository.findById(nhomId);
  }

  async themThanhVien(nhomId, sinhVienId, vaiTro = 'THANH_VIEN') {
    // Kiểm tra nhóm tồn tại
    const nhom = await nhomNghienCuuRepository.findById(nhomId);
    if (!nhom) {
      throw new Error('Không tìm thấy nhóm');
    }

    // Kiểm tra sinh viên tồn tại
    const sinhVien = await sinhVienRepository.findById(sinhVienId);
    if (!sinhVien) {
      throw new Error('Không tìm thấy sinh viên');
    }

    // Kiểm tra sinh viên đã trong nhóm chưa
    const daThamGia = await nhomNghienCuuRepository.checkMemberInGroup(nhomId, sinhVienId);
    if (daThamGia) {
      throw new Error('Sinh viên đã có trong nhóm');
    }

    // Kiểm tra số lượng thành viên tối đa
    let soLuongThanhVienToiDa = 5;
    if (nhom.de_tai_id) {
      const deTai = await deTaiRepository.findById(nhom.de_tai_id);
      if (deTai?.so_luong_thanh_vien_toi_da) {
        soLuongThanhVienToiDa = deTai.so_luong_thanh_vien_toi_da;
      }
    }

    if (nhom.so_luong_thanh_vien >= soLuongThanhVienToiDa) {
      throw new Error(`Nhóm đã đủ số lượng thành viên tối đa (${soLuongThanhVienToiDa})`);
    }

    // Thêm thành viên
    const result = await nhomNghienCuuRepository.addMember(nhomId, sinhVienId, vaiTro);

    // Cập nhật số lượng thành viên
    await nhomNghienCuuRepository.updateMemberCount(nhomId);

    return result;
  }

  async xoaThanhVien(nhomId, sinhVienId) {
    // Kiểm tra nhóm tồn tại
    const nhom = await nhomNghienCuuRepository.findById(nhomId);
    if (!nhom) {
      throw new Error('Không tìm thấy nhóm');
    }

    // Không cho phép xóa trưởng nhóm
    if (nhom.truong_nhom_id === sinhVienId) {
      throw new Error('Không thể xóa trưởng nhóm');
    }

    // Xóa thành viên
    await nhomNghienCuuRepository.removeMember(nhomId, sinhVienId);

    // Cập nhật số lượng thành viên
    await nhomNghienCuuRepository.updateMemberCount(nhomId);
  }

  async getDanhSachThanhVien(nhomId) {
    return await nhomNghienCuuRepository.getMembers(nhomId);
  }

  async generateMaNhom() {
    const year = new Date().getFullYear();
    const count = await nhomNghienCuuRepository.countByYear(year);
    return `NHOM${year}${String(count + 1).padStart(4, '0')}`;
  }
}

module.exports = new NhomNghienCuuService();
