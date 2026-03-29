// Constants cho hệ thống

// Trạng thái đề tài
const TRANG_THAI_DE_TAI = {
  MO_DANG_KY: 'MO_DANG_KY',
  DANG_THUC_HIEN: 'DANG_THUC_HIEN',
  HOAN_THANH: 'HOAN_THANH',
  HUY: 'HUY'
};

// Trạng thái nhóm nghiên cứu
const TRANG_THAI_NHOM = {
  CHO_DUYET: 'CHO_DUYET',
  DA_DUYET: 'DA_DUYET',
  DANG_THUC_HIEN: 'DANG_THUC_HIEN',
  HOAN_THANH: 'HOAN_THANH',
  TU_CHOI: 'TU_CHOI'
};

// Trạng thái hồ sơ đăng ký
const TRANG_THAI_HO_SO = {
  CHO_PHE_DUYET: 'CHO_PHE_DUYET',
  DA_NOP: 'DA_NOP',
  DA_DUYET: 'DA_DUYET',
  TU_CHOI: 'TU_CHOI',
  CAN_CHINH_SUA: 'CAN_CHINH_SUA'
};

// Vai trò trong nhóm
const VAI_TRO_NHOM = {
  TRUONG_NHOM: 'TRUONG_NHOM',
  THANH_VIEN: 'THANH_VIEN'
};

// Loại người dùng
const LOAI_NGUOI_DUNG = {
  SINH_VIEN: 'SINH_VIEN',
  GIANG_VIEN: 'GIANG_VIEN',
  CAN_BO: 'CAN_BO',
  QUAN_TRI: 'QUAN_TRI'
};

// Loại thông báo
const LOAI_THONG_BAO = {
  DANG_KY_DE_TAI: 'DANG_KY_DE_TAI',
  PHE_DUYET: 'PHE_DUYET',
  NHAN_XET: 'NHAN_XET',
  LICH_BAO_VE: 'LICH_BAO_VE',
  KET_QUA: 'KET_QUA',
  THONG_BAO_CHUNG: 'THONG_BAO_CHUNG'
};

// Kết quả phê duyệt
const KET_QUA_PHE_DUYET = {
  DONG_Y: 'DONG_Y',
  TU_CHOI: 'TU_CHOI',
  YEU_CAU_CHINH_SUA: 'YEU_CAU_CHINH_SUA'
};

module.exports = {
  TRANG_THAI_DE_TAI,
  TRANG_THAI_NHOM,
  TRANG_THAI_HO_SO,
  VAI_TRO_NHOM,
  LOAI_NGUOI_DUNG,
  LOAI_THONG_BAO,
  KET_QUA_PHE_DUYET
};
