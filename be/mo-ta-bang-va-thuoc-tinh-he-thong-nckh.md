# Mô tả các bảng và thuộc tính của hệ thống quản lý nghiên cứu khoa học sinh viên

Tài liệu này tổng hợp các bảng cần có cho hệ thống **Quản lý nghiên cứu khoa học của sinh viên** theo cấu trúc thiết kế dữ liệu trong báo cáo. Danh sách thực thể trong báo cáo gồm 23 bảng chính: `TaiKhoan`, `VaiTro`, `SinhVien`, `GiangVien`, `Khoa`, `LinhVucNghienCuu`, `DeTaiNghienCuu`, `NhomNghienCuu`, `ThanhVienNhom`, `HoSoDangKyDeTai`, `PheDuyetDeTai`, `DeCuong`, `PhienBanDeCuong`, `NhanXetDeCuong`, `BaoCaoTienDo`, `NhanXetTienDo`, `BaoCaoCuoiCung`, `HoiDongKhoaHoc`, `ThanhVienHoiDong`, `LichBaoVe`, `DanhGiaChamDiem`, `ThongBao`, `TepDinhKem`.

> Ghi chú:
> - Các bảng `SinhVien`, `GiangVien` và danh sách thực thể được bám theo báo cáo.
> - Một số thuộc tính bên dưới được chuẩn hóa lại để tiện code BE/FE và thiết kế API.
> - Kiểu dữ liệu tham chiếu theo hướng phù hợp với PostgreSQL.

---

## 1) Bảng `VaiTro`
Mục đích: quản lý vai trò người dùng trong hệ thống.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `vai_tro_id` | `serial` | PK | Khóa chính |
| `ten_vai_tro` | `varchar(50)` | NOT NULL, UNIQUE | Tên vai trò: `SinhVien`, `GiangVien`, `QuanLyNCKH`, `HoiDong`, `Admin` |
| `mo_ta` | `varchar(255)` | NULL | Mô tả vai trò |
| `trang_thai` | `smallint` | NOT NULL DEFAULT 1 | 1-hoạt động, 0-ngưng |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 2) Bảng `TaiKhoan`
Mục đích: xác thực, phân quyền, khóa/mở tài khoản.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `tai_khoan_id` | `serial` | PK | Khóa chính |
| `ten_dang_nhap` | `varchar(50)` | NOT NULL, UNIQUE | Tên đăng nhập |
| `mat_khau_hash` | `varchar(255)` | NOT NULL | Mật khẩu đã mã hóa |
| `vai_tro_id` | `int` | NOT NULL, FK -> `VaiTro(vai_tro_id)` | Vai trò |
| `nguoi_dung_id` | `int` | NOT NULL | ID bản ghi người dùng tương ứng |
| `loai_nguoi_dung` | `varchar(20)` | NOT NULL | `SinhVien`, `GiangVien`, `CanBoQuanLy`, `ThanhVienHoiDong`, `Admin` |
| `trang_thai` | `smallint` | NOT NULL DEFAULT 1 | 1-hoạt động, 0-khóa |
| `so_lan_dang_nhap_sai` | `int` | NOT NULL DEFAULT 0 | Số lần đăng nhập sai liên tiếp |
| `khoa_den` | `timestamp` | NULL | Thời điểm khóa tạm |
| `lan_dang_nhap_cuoi` | `timestamp` | NULL | Lần đăng nhập gần nhất |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 3) Bảng `Khoa`
Mục đích: danh mục khoa/đơn vị quản lý.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `khoa_id` | `serial` | PK | Khóa chính |
| `ma_khoa` | `varchar(20)` | NOT NULL, UNIQUE | Mã khoa |
| `ten_khoa` | `varchar(150)` | NOT NULL | Tên khoa |
| `email_lien_he` | `varchar(100)` | NULL | Email khoa |
| `so_dien_thoai` | `varchar(15)` | NULL | Điện thoại |
| `trang_thai` | `smallint` | NOT NULL DEFAULT 1 | Trạng thái |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 4) Bảng `SinhVien`
Mục đích: lưu hồ sơ sinh viên tham gia nghiên cứu.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `sinh_vien_id` | `serial` | PK | Khóa chính |
| `ma_sinh_vien` | `varchar(20)` | NOT NULL, UNIQUE | Mã sinh viên |
| `ho_ten` | `varchar(100)` | NOT NULL | Họ tên sinh viên |
| `ngay_sinh` | `date` | NULL | Ngày sinh |
| `gioi_tinh` | `smallint` | NULL | 0-Nữ, 1-Nam, 2-Khác |
| `email` | `varchar(100)` | NOT NULL, UNIQUE | Email |
| `so_dien_thoai` | `varchar(15)` | NULL | Số điện thoại |
| `khoa_id` | `int` | NOT NULL, FK -> `Khoa(khoa_id)` | Khoa quản lý |
| `lop` | `varchar(30)` | NULL | Lớp hành chính |
| `khoa_hoc` | `varchar(20)` | NULL | Ví dụ `K2022` |
| `trang_thai` | `smallint` | NOT NULL DEFAULT 1 | 1-đang học, 0-ngừng/ra trường |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 5) Bảng `GiangVien`
Mục đích: lưu thông tin giảng viên hướng dẫn.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `giang_vien_id` | `serial` | PK | Khóa chính |
| `ma_giang_vien` | `varchar(20)` | NOT NULL, UNIQUE | Mã giảng viên |
| `ho_ten` | `varchar(100)` | NOT NULL | Họ tên giảng viên |
| `email` | `varchar(100)` | NOT NULL, UNIQUE | Email |
| `so_dien_thoai` | `varchar(15)` | NULL | Số điện thoại |
| `khoa_id` | `int` | NOT NULL, FK -> `Khoa(khoa_id)` | Khoa/đơn vị công tác |
| `chuyen_mon` | `varchar(255)` | NULL | Chuyên môn/lĩnh vực nghiên cứu |
| `so_luong_huong_dan_toi_da` | `int` | NOT NULL DEFAULT 0 | Số nhóm tối đa được hướng dẫn |
| `trang_thai` | `smallint` | NOT NULL DEFAULT 1 | 1-đang công tác, 0-ngưng |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 6) Bảng `LinhVucNghienCuu`
Mục đích: danh mục lĩnh vực nghiên cứu.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `linh_vuc_id` | `serial` | PK | Khóa chính |
| `ma_linh_vuc` | `varchar(20)` | NOT NULL, UNIQUE | Mã lĩnh vực |
| `ten_linh_vuc` | `varchar(150)` | NOT NULL | Tên lĩnh vực |
| `mo_ta` | `text` | NULL | Mô tả |
| `trang_thai` | `smallint` | NOT NULL DEFAULT 1 | Trạng thái |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 7) Bảng `DeTaiNghienCuu`
Mục đích: lưu thông tin đề tài nghiên cứu.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `de_tai_id` | `serial` | PK | Khóa chính |
| `ma_de_tai` | `varchar(30)` | NOT NULL, UNIQUE | Mã đề tài |
| `ten_de_tai` | `varchar(255)` | NOT NULL | Tên đề tài |
| `linh_vuc_id` | `int` | NOT NULL, FK -> `LinhVucNghienCuu(linh_vuc_id)` | Lĩnh vực |
| `mo_ta` | `text` | NULL | Mô tả đề tài |
| `muc_tieu` | `text` | NULL | Mục tiêu nghiên cứu |
| `yeu_cau` | `text` | NULL | Yêu cầu/đầu ra dự kiến |
| `so_luong_thanh_vien_toi_da` | `int` | NOT NULL DEFAULT 5 | Giới hạn thành viên nhóm |
| `giang_vien_huong_dan_id` | `int` | NULL, FK -> `GiangVien(giang_vien_id)` | Giảng viên hướng dẫn chính |
| `trang_thai` | `varchar(30)` | NOT NULL DEFAULT 'MO_DANG_KY' | `MO_DANG_KY`, `CHO_PHE_DUYET`, `DA_DUYET`, `DANG_THUC_HIEN`, `CHAM_TIEN_DO`, `HOAN_THANH`, `TU_CHOI` |
| `nam_hoc` | `varchar(20)` | NULL | Năm học áp dụng |
| `hoc_ky` | `varchar(10)` | NULL | Học kỳ |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 8) Bảng `NhomNghienCuu`
Mục đích: lưu nhóm sinh viên thực hiện đề tài.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `nhom_id` | `serial` | PK | Khóa chính |
| `ma_nhom` | `varchar(30)` | NOT NULL, UNIQUE | Mã nhóm |
| `ten_nhom` | `varchar(150)` | NOT NULL | Tên nhóm |
| `truong_nhom_id` | `int` | NOT NULL, FK -> `SinhVien(sinh_vien_id)` | Trưởng nhóm |
| `de_tai_id` | `int` | NOT NULL, FK -> `DeTaiNghienCuu(de_tai_id)` | Đề tài nhóm đăng ký/thực hiện |
| `giang_vien_huong_dan_id` | `int` | NULL, FK -> `GiangVien(giang_vien_id)` | GVHD được chọn |
| `so_luong_thanh_vien` | `int` | NOT NULL DEFAULT 1 | Tổng thành viên hiện có |
| `trang_thai` | `varchar(30)` | NOT NULL DEFAULT 'CHO_DUYET' | Trạng thái nhóm |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 9) Bảng `ThanhVienNhom`
Mục đích: bảng liên kết nhóm - sinh viên.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `thanh_vien_nhom_id` | `serial` | PK | Khóa chính |
| `nhom_id` | `int` | NOT NULL, FK -> `NhomNghienCuu(nhom_id)` | Nhóm |
| `sinh_vien_id` | `int` | NOT NULL, FK -> `SinhVien(sinh_vien_id)` | Sinh viên |
| `vai_tro_trong_nhom` | `varchar(30)` | NOT NULL DEFAULT 'THANH_VIEN' | `TRUONG_NHOM`, `THANH_VIEN` |
| `ngay_tham_gia` | `timestamp` | NOT NULL DEFAULT now() | Ngày tham gia |
| `trang_thai` | `smallint` | NOT NULL DEFAULT 1 | Trạng thái tham gia |

> Nên đặt UNIQUE (`nhom_id`, `sinh_vien_id`) để tránh trùng thành viên.

---

## 10) Bảng `HoSoDangKyDeTai`
Mục đích: lưu hồ sơ đăng ký đề tài của nhóm.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `ho_so_id` | `serial` | PK | Khóa chính |
| `nhom_id` | `int` | NOT NULL, FK -> `NhomNghienCuu(nhom_id)` | Nhóm đăng ký |
| `de_tai_id` | `int` | NOT NULL, FK -> `DeTaiNghienCuu(de_tai_id)` | Đề tài đăng ký |
| `ngay_dang_ky` | `timestamp` | NOT NULL DEFAULT now() | Thời điểm đăng ký |
| `ly_do_chon_de_tai` | `text` | NULL | Mô tả đăng ký |
| `trang_thai` | `varchar(30)` | NOT NULL DEFAULT 'CHO_PHE_DUYET' | `CHO_PHE_DUYET`, `YEU_CAU_CHINH_SUA`, `DA_DUYET`, `TU_CHOI` |
| `ghi_chu` | `text` | NULL | Ghi chú chung |
| `nguoi_tao_id` | `int` | NULL | Người tạo hồ sơ |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 11) Bảng `PheDuyetDeTai`
Mục đích: lưu lịch sử thẩm định/phê duyệt đề tài.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `phe_duyet_id` | `serial` | PK | Khóa chính |
| `ho_so_id` | `int` | NOT NULL, FK -> `HoSoDangKyDeTai(ho_so_id)` | Hồ sơ được xét duyệt |
| `nguoi_duyet_id` | `int` | NOT NULL | ID cán bộ quản lý/hội đồng xử lý |
| `loai_nguoi_duyet` | `varchar(30)` | NOT NULL | `QUAN_LY`, `HOI_DONG` |
| `ket_qua` | `varchar(30)` | NOT NULL | `DA_DUYET`, `TU_CHOI`, `YEU_CAU_CHINH_SUA` |
| `nhan_xet` | `text` | NULL | Nhận xét phê duyệt |
| `thoi_gian_duyet` | `timestamp` | NOT NULL DEFAULT now() | Thời gian xử lý |

---

## 12) Bảng `DeCuong`
Mục đích: lưu bản đề cương hiện hành của đề tài/nhóm.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `de_cuong_id` | `serial` | PK | Khóa chính |
| `de_tai_id` | `int` | NOT NULL, FK -> `DeTaiNghienCuu(de_tai_id)` | Đề tài |
| `nhom_id` | `int` | NOT NULL, FK -> `NhomNghienCuu(nhom_id)` | Nhóm thực hiện |
| `tieu_de` | `varchar(255)` | NOT NULL | Tên đề cương |
| `muc_tieu` | `text` | NULL | Mục tiêu |
| `noi_dung` | `text` | NULL | Nội dung tổng quát |
| `ke_hoach_thuc_hien` | `text` | NULL | Kế hoạch thực hiện |
| `trang_thai` | `varchar(30)` | NOT NULL DEFAULT 'BAN_NHAP' | `BAN_NHAP`, `CHO_GV_NHAN_XET`, `CHO_HD_PHE_DUYET`, `DA_PHE_DUYET`, `CAN_CHINH_SUA` |
| `phien_ban_hien_tai` | `int` | NOT NULL DEFAULT 1 | Phiên bản hiện tại |
| `han_nop` | `timestamp` | NULL | Hạn nộp |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 13) Bảng `PhienBanDeCuong`
Mục đích: lưu lịch sử các phiên bản đề cương.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `phien_ban_id` | `serial` | PK | Khóa chính |
| `de_cuong_id` | `int` | NOT NULL, FK -> `DeCuong(de_cuong_id)` | Đề cương |
| `so_phien_ban` | `int` | NOT NULL | Số phiên bản |
| `tep_dinh_kem_id` | `int` | NULL, FK -> `TepDinhKem(tep_dinh_kem_id)` | File đề cương |
| `ghi_chu_thay_doi` | `text` | NULL | Nội dung chỉnh sửa |
| `nguoi_nop_id` | `int` | NOT NULL | Người nộp |
| `ngay_nop` | `timestamp` | NOT NULL DEFAULT now() | Ngày nộp |

> Nên đặt UNIQUE (`de_cuong_id`, `so_phien_ban`).

---

## 14) Bảng `NhanXetDeCuong`
Mục đích: nhận xét của giảng viên/hội đồng với đề cương.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `nhan_xet_de_cuong_id` | `serial` | PK | Khóa chính |
| `de_cuong_id` | `int` | NOT NULL, FK -> `DeCuong(de_cuong_id)` | Đề cương |
| `nguoi_nhan_xet_id` | `int` | NOT NULL | Người nhận xét |
| `loai_nguoi_nhan_xet` | `varchar(30)` | NOT NULL | `GIANG_VIEN`, `HOI_DONG` |
| `noi_dung_nhan_xet` | `text` | NOT NULL | Nội dung góp ý |
| `ket_qua` | `varchar(30)` | NOT NULL | `DAT`, `CAN_CHINH_SUA`, `KHONG_DAT` |
| `ngay_nhan_xet` | `timestamp` | NOT NULL DEFAULT now() | Ngày nhận xét |

---

## 15) Bảng `BaoCaoTienDo`
Mục đích: lưu các lần nộp báo cáo tiến độ.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `bao_cao_tien_do_id` | `serial` | PK | Khóa chính |
| `de_tai_id` | `int` | NOT NULL, FK -> `DeTaiNghienCuu(de_tai_id)` | Đề tài |
| `nhom_id` | `int` | NOT NULL, FK -> `NhomNghienCuu(nhom_id)` | Nhóm |
| `giai_doan` | `varchar(50)` | NOT NULL | Giai đoạn nghiên cứu |
| `tieu_de` | `varchar(255)` | NOT NULL | Tiêu đề báo cáo |
| `noi_dung_tom_tat` | `text` | NULL | Nội dung tóm tắt |
| `ty_le_hoan_thanh` | `numeric(5,2)` | NULL | % hoàn thành |
| `han_nop` | `timestamp` | NULL | Hạn nộp |
| `ngay_nop` | `timestamp` | NULL | Ngày nộp thực tế |
| `trang_thai` | `varchar(30)` | NOT NULL DEFAULT 'BAN_NHAP' | `BAN_NHAP`, `DA_NOP`, `QUA_HAN`, `DA_NHAN_XET` |
| `tep_dinh_kem_id` | `int` | NULL, FK -> `TepDinhKem(tep_dinh_kem_id)` | File báo cáo |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 16) Bảng `NhanXetTienDo`
Mục đích: lưu nhận xét tiến độ của giảng viên/hội đồng.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `nhan_xet_tien_do_id` | `serial` | PK | Khóa chính |
| `bao_cao_tien_do_id` | `int` | NOT NULL, FK -> `BaoCaoTienDo(bao_cao_tien_do_id)` | Báo cáo tiến độ |
| `nguoi_nhan_xet_id` | `int` | NOT NULL | Người nhận xét |
| `loai_nguoi_nhan_xet` | `varchar(30)` | NOT NULL | `GIANG_VIEN`, `HOI_DONG` |
| `noi_dung_nhan_xet` | `text` | NOT NULL | Nội dung nhận xét |
| `danh_gia` | `varchar(30)` | NOT NULL | `DAT`, `CAN_BO_SUNG`, `CHAM_TIEN_DO` |
| `ngay_nhan_xet` | `timestamp` | NOT NULL DEFAULT now() | Ngày nhận xét |

---

## 17) Bảng `BaoCaoCuoiCung`
Mục đích: lưu báo cáo nghiên cứu cuối cùng để xét điều kiện bảo vệ.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `bao_cao_cuoi_cung_id` | `serial` | PK | Khóa chính |
| `de_tai_id` | `int` | NOT NULL, FK -> `DeTaiNghienCuu(de_tai_id)` | Đề tài |
| `nhom_id` | `int` | NOT NULL, FK -> `NhomNghienCuu(nhom_id)` | Nhóm |
| `tieu_de` | `varchar(255)` | NOT NULL | Tiêu đề báo cáo cuối |
| `tom_tat` | `text` | NULL | Tóm tắt |
| `tep_dinh_kem_id` | `int` | NULL, FK -> `TepDinhKem(tep_dinh_kem_id)` | File báo cáo cuối |
| `ngay_nop` | `timestamp` | NOT NULL DEFAULT now() | Ngày nộp |
| `du_dieu_kien_bao_ve` | `boolean` | NOT NULL DEFAULT false | Đủ điều kiện bảo vệ hay chưa |
| `nhan_xet_gvhd` | `text` | NULL | Nhận xét của GVHD |
| `trang_thai` | `varchar(30)` | NOT NULL DEFAULT 'DA_NOP' | `DA_NOP`, `CAN_CHINH_SUA`, `DU_DIEU_KIEN_BAO_VE` |

---

## 18) Bảng `HoiDongKhoaHoc`
Mục đích: quản lý hội đồng phục vụ thẩm định/bảo vệ.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `hoi_dong_id` | `serial` | PK | Khóa chính |
| `ma_hoi_dong` | `varchar(30)` | NOT NULL, UNIQUE | Mã hội đồng |
| `ten_hoi_dong` | `varchar(255)` | NOT NULL | Tên hội đồng |
| `cap_hoi_dong` | `varchar(30)` | NOT NULL | `CAP_KHOA`, `CAP_TRUONG` |
| `nam_hoc` | `varchar(20)` | NULL | Năm học |
| `mo_ta` | `text` | NULL | Mô tả |
| `trang_thai` | `smallint` | NOT NULL DEFAULT 1 | Trạng thái |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |
| `ngay_cap_nhat` | `timestamp` | NOT NULL DEFAULT now() | Ngày cập nhật |

---

## 19) Bảng `ThanhVienHoiDong`
Mục đích: lưu các thành viên trong hội đồng.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `thanh_vien_hoi_dong_id` | `serial` | PK | Khóa chính |
| `hoi_dong_id` | `int` | NOT NULL, FK -> `HoiDongKhoaHoc(hoi_dong_id)` | Hội đồng |
| `giang_vien_id` | `int` | NOT NULL, FK -> `GiangVien(giang_vien_id)` | Giảng viên tham gia |
| `vai_tro_trong_hoi_dong` | `varchar(30)` | NOT NULL | `CHU_TICH`, `THU_KY`, `PHAN_BIEN`, `UY_VIEN` |
| `trang_thai` | `smallint` | NOT NULL DEFAULT 1 | Trạng thái |

> Nên đặt UNIQUE (`hoi_dong_id`, `giang_vien_id`).

---

## 20) Bảng `LichBaoVe`
Mục đích: lập lịch bảo vệ đề tài.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `lich_bao_ve_id` | `serial` | PK | Khóa chính |
| `de_tai_id` | `int` | NOT NULL, FK -> `DeTaiNghienCuu(de_tai_id)` | Đề tài bảo vệ |
| `nhom_id` | `int` | NOT NULL, FK -> `NhomNghienCuu(nhom_id)` | Nhóm bảo vệ |
| `hoi_dong_id` | `int` | NOT NULL, FK -> `HoiDongKhoaHoc(hoi_dong_id)` | Hội đồng chấm |
| `thoi_gian_bat_dau` | `timestamp` | NOT NULL | Thời gian bắt đầu |
| `thoi_gian_ket_thuc` | `timestamp` | NOT NULL | Thời gian kết thúc |
| `dia_diem` | `varchar(255)` | NULL | Địa điểm/phòng bảo vệ |
| `trang_thai` | `varchar(30)` | NOT NULL DEFAULT 'DU_KIEN' | `DU_KIEN`, `DA_CONG_BO`, `DA_DIEN_RA`, `HOAN` |
| `ghi_chu` | `text` | NULL | Ghi chú |
| `ngay_tao` | `timestamp` | NOT NULL DEFAULT now() | Ngày tạo |

---

## 21) Bảng `DanhGiaChamDiem`
Mục đích: lưu kết quả chấm điểm đề tài sau bảo vệ.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `danh_gia_id` | `serial` | PK | Khóa chính |
| `lich_bao_ve_id` | `int` | NOT NULL, FK -> `LichBaoVe(lich_bao_ve_id)` | Phiên bảo vệ |
| `de_tai_id` | `int` | NOT NULL, FK -> `DeTaiNghienCuu(de_tai_id)` | Đề tài |
| `hoi_dong_id` | `int` | NOT NULL, FK -> `HoiDongKhoaHoc(hoi_dong_id)` | Hội đồng |
| `nguoi_cham_id` | `int` | NULL, FK -> `GiangVien(giang_vien_id)` | Người chấm, nếu lưu theo từng thành viên |
| `diem_noi_dung` | `numeric(4,2)` | NULL | Điểm nội dung |
| `diem_phuong_phap` | `numeric(4,2)` | NULL | Điểm phương pháp |
| `diem_trinh_bay` | `numeric(4,2)` | NULL | Điểm trình bày |
| `diem_tinh_ung_dung` | `numeric(4,2)` | NULL | Điểm tính ứng dụng |
| `diem_tong` | `numeric(4,2)` | NULL | Điểm tổng |
| `ket_luan` | `varchar(30)` | NOT NULL | `DAT`, `KHONG_DAT`, `CAN_CHINH_SUA` |
| `nhan_xet` | `text` | NULL | Nhận xét chung |
| `ngay_cham` | `timestamp` | NOT NULL DEFAULT now() | Ngày chấm |

---

## 22) Bảng `ThongBao`
Mục đích: gửi thông báo cho sinh viên, giảng viên, hội đồng.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `thong_bao_id` | `serial` | PK | Khóa chính |
| `tieu_de` | `varchar(255)` | NOT NULL | Tiêu đề thông báo |
| `noi_dung` | `text` | NOT NULL | Nội dung |
| `nguoi_nhan_id` | `int` | NOT NULL | ID người nhận |
| `loai_nguoi_nhan` | `varchar(30)` | NOT NULL | `SINH_VIEN`, `GIANG_VIEN`, `QUAN_LY`, `HOI_DONG` |
| `loai_thong_bao` | `varchar(50)` | NOT NULL | `PHE_DUYET_DE_TAI`, `NHAC_HAN`, `CHAM_TIEN_DO`, `LICH_BAO_VE`, `KET_QUA_CHAM` |
| `da_doc` | `boolean` | NOT NULL DEFAULT false | Đã đọc hay chưa |
| `thoi_gian_gui` | `timestamp` | NOT NULL DEFAULT now() | Thời gian gửi |
| `duong_dan` | `varchar(255)` | NULL | Link điều hướng trên FE |

---

## 23) Bảng `TepDinhKem`
Mục đích: dùng chung cho đề cương, báo cáo tiến độ, báo cáo cuối, hồ sơ khác.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `tep_dinh_kem_id` | `serial` | PK | Khóa chính |
| `ten_tep_goc` | `varchar(255)` | NOT NULL | Tên file gốc |
| `ten_tep_luu` | `varchar(255)` | NOT NULL | Tên file lưu trên server/cloud |
| `duong_dan` | `varchar(500)` | NOT NULL | Đường dẫn file |
| `loai_tep` | `varchar(100)` | NULL | MIME type / extension |
| `kich_thuoc_byte` | `bigint` | NULL | Kích thước file |
| `nguoi_tai_len_id` | `int` | NOT NULL | Người upload |
| `ngay_tai_len` | `timestamp` | NOT NULL DEFAULT now() | Ngày tải lên |
| `mo_ta` | `varchar(255)` | NULL | Mô tả file |

---

# Quan hệ chính giữa các bảng

## Nhóm tài khoản và người dùng
- `VaiTro` 1 - n `TaiKhoan`
- `Khoa` 1 - n `SinhVien`
- `Khoa` 1 - n `GiangVien`

## Nhóm đăng ký đề tài
- `LinhVucNghienCuu` 1 - n `DeTaiNghienCuu`
- `GiangVien` 1 - n `DeTaiNghienCuu`
- `DeTaiNghienCuu` 1 - n `NhomNghienCuu` *(nếu cho phép nhiều nhóm đăng ký theo hồ sơ, nhưng khi duyệt chính thức nên ràng buộc chỉ 1 nhóm được chọn)*
- `NhomNghienCuu` 1 - n `ThanhVienNhom`
- `SinhVien` 1 - n `ThanhVienNhom`
- `NhomNghienCuu` 1 - n `HoSoDangKyDeTai`
- `HoSoDangKyDeTai` 1 - n `PheDuyetDeTai`

## Nhóm thực hiện nghiên cứu
- `DeTaiNghienCuu` 1 - n `DeCuong`
- `DeCuong` 1 - n `PhienBanDeCuong`
- `DeCuong` 1 - n `NhanXetDeCuong`
- `DeTaiNghienCuu` 1 - n `BaoCaoTienDo`
- `BaoCaoTienDo` 1 - n `NhanXetTienDo`
- `DeTaiNghienCuu` 1 - 1 hoặc 1 - n `BaoCaoCuoiCung`

## Nhóm bảo vệ và chấm điểm
- `HoiDongKhoaHoc` 1 - n `ThanhVienHoiDong`
- `HoiDongKhoaHoc` 1 - n `LichBaoVe`
- `DeTaiNghienCuu` 1 - n `LichBaoVe`
- `LichBaoVe` 1 - n `DanhGiaChamDiem`

## Nhóm hỗ trợ dùng chung
- `TepDinhKem` được tham chiếu bởi `PhienBanDeCuong`, `BaoCaoTienDo`, `BaoCaoCuoiCung`
- `ThongBao` là bảng độc lập, tham chiếu mềm tới người nhận bằng `nguoi_nhan_id` + `loai_nguoi_nhan`

---

# Các ràng buộc nghiệp vụ nên thêm ở mức DB hoặc BE

1. Một sinh viên không được thuộc hai nhóm khác nhau của cùng một đề tài.
2. Một đề tài chỉ được phê duyệt chính thức cho một nhóm tại một thời điểm.
3. Số lượng thành viên của nhóm không vượt quá `so_luong_thanh_vien_toi_da` của đề tài.
4. Giảng viên không được nhận vượt `so_luong_huong_dan_toi_da`.
5. Không cho lập `LichBaoVe` nếu chưa có `BaoCaoCuoiCung` đủ điều kiện bảo vệ.
6. Không cho chấm điểm nếu lịch bảo vệ chưa diễn ra.
7. File upload nên giới hạn định dạng: `pdf`, `docx`, `pptx`, `xlsx`, `zip` nếu cần.

---

# Gợi ý bảng tối thiểu nếu nhóm muốn code trước

Nếu làm theo hướng ưu tiên nghiệp vụ trước, có thể triển khai theo 3 đợt:

## Đợt 1: Đăng ký đề tài
- `VaiTro`
- `TaiKhoan`
- `Khoa`
- `SinhVien`
- `GiangVien`
- `LinhVucNghienCuu`
- `DeTaiNghienCuu`
- `NhomNghienCuu`
- `ThanhVienNhom`
- `HoSoDangKyDeTai`
- `PheDuyetDeTai`
- `ThongBao`

## Đợt 2: Đề cương và tiến độ
- `DeCuong`
- `PhienBanDeCuong`
- `NhanXetDeCuong`
- `BaoCaoTienDo`
- `NhanXetTienDo`
- `BaoCaoCuoiCung`
- `TepDinhKem`

## Đợt 3: Bảo vệ và chấm điểm
- `HoiDongKhoaHoc`
- `ThanhVienHoiDong`
- `LichBaoVe`
- `DanhGiaChamDiem`

---

# Gợi ý đặt tên cho code NodeJS + PostgreSQL

- Tên bảng: `snake_case`
- Tên cột khóa chính: `*_id`
- Tên khóa ngoại: trùng tên khóa chính của bảng cha
- Các cột trạng thái nên dùng `varchar enum-like` nếu muốn dễ đọc ở FE, hoặc `smallint` nếu muốn tối ưu
- Các bảng nghiệp vụ nên có ít nhất `ngay_tao`, `ngay_cap_nhat`

---

# Nguồn bám theo báo cáo
- Danh sách 23 thực thể/bảng nằm trong phần **4.1.1. Xác định tập thực thể** của báo cáo.
- Thuộc tính chi tiết của `SinhVien`, `GiangVien`, `VaiTro` được chuẩn hóa theo phần **4.1.2. Đặc tả cơ sở dữ liệu** trong báo cáo.

