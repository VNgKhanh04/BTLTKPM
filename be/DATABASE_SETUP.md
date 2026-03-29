# Hướng dẫn thiết lập Database với Prisma và Supabase

## Thông tin kết nối

- Database: PostgreSQL (Supabase)
- URL: `postgresql://postgres:by29cJElOZJ7dSqp@db.wkwlndqlkibuhhtmikbx.supabase.co:5432/postgres`
- Đã lưu trong file `.env`

## Cấu trúc Database

Hệ thống bao gồm 23 bảng chính:

### Nhóm Tài khoản và Người dùng
1. `VaiTro` - Quản lý vai trò người dùng
2. `TaiKhoan` - Xác thực và phân quyền
3. `Khoa` - Danh mục khoa/đơn vị
4. `SinhVien` - Hồ sơ sinh viên
5. `GiangVien` - Thông tin giảng viên

### Nhóm Đăng ký Đề tài
6. `LinhVucNghienCuu` - Danh mục lĩnh vực
7. `DeTaiNghienCuu` - Thông tin đề tài
8. `NhomNghienCuu` - Nhóm sinh viên
9. `ThanhVienNhom` - Thành viên trong nhóm
10. `HoSoDangKyDeTai` - Hồ sơ đăng ký
11. `PheDuyetDeTai` - Lịch sử phê duyệt

### Nhóm Thực hiện Nghiên cứu
12. `DeCuong` - Đề cương nghiên cứu
13. `PhienBanDeCuong` - Lịch sử phiên bản
14. `NhanXetDeCuong` - Nhận xét đề cương
15. `BaoCaoTienDo` - Báo cáo tiến độ
16. `NhanXetTienDo` - Nhận xét tiến độ
17. `BaoCaoCuoiCung` - Báo cáo cuối cùng

### Nhóm Bảo vệ và Chấm điểm
18. `HoiDongKhoaHoc` - Hội đồng khoa học
19. `ThanhVienHoiDong` - Thành viên hội đồng
20. `LichBaoVe` - Lịch bảo vệ đề tài
21. `DanhGiaChamDiem` - Kết quả chấm điểm

### Nhóm Hỗ trợ
22. `ThongBao` - Thông báo hệ thống
23. `TepDinhKem` - Quản lý file đính kèm

## Các lệnh Prisma

### 1. Tạo migration mới
```bash
npm run prisma:migrate
```

### 2. Đẩy schema lên database (không tạo migration)
```bash
npm run prisma:push
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Mở Prisma Studio (GUI quản lý database)
```bash
npm run prisma:studio
```

### 5. Reset database (xóa tất cả dữ liệu)
```bash
npx prisma migrate reset
```

### 6. Xem trạng thái migration
```bash
npx prisma migrate status
```

## Sử dụng Prisma Client trong code

```javascript
const prisma = require('./config/prisma');

// Ví dụ: Lấy danh sách sinh viên
const sinhViens = await prisma.sinhVien.findMany({
  include: {
    Khoa: true,
    ThanhVienNhom: true
  }
});

// Ví dụ: Tạo đề tài mới
const deTai = await prisma.deTaiNghienCuu.create({
  data: {
    ma_de_tai: 'DT001',
    ten_de_tai: 'Nghiên cứu AI',
    linh_vuc_id: 1,
    trang_thai: 'MO_DANG_KY'
  }
});

// Ví dụ: Cập nhật trạng thái
await prisma.deTaiNghienCuu.update({
  where: { de_tai_id: 1 },
  data: { trang_thai: 'DA_DUYET' }
});

// Ví dụ: Xóa (soft delete bằng cách cập nhật trang_thai)
await prisma.sinhVien.update({
  where: { sinh_vien_id: 1 },
  data: { trang_thai: 0 }
});
```

## Trạng thái của các bảng

### DeTaiNghienCuu
- `MO_DANG_KY` - Mở đăng ký
- `CHO_PHE_DUYET` - Chờ phê duyệt
- `DA_DUYET` - Đã duyệt
- `DANG_THUC_HIEN` - Đang thực hiện
- `CHAM_TIEN_DO` - Chậm tiến độ
- `HOAN_THANH` - Hoàn thành
- `TU_CHOI` - Từ chối

### DeCuong
- `BAN_NHAP` - Bản nháp
- `CHO_GV_NHAN_XET` - Chờ giảng viên nhận xét
- `CHO_HD_PHE_DUYET` - Chờ hội đồng phê duyệt
- `DA_PHE_DUYET` - Đã phê duyệt
- `CAN_CHINH_SUA` - Cần chỉnh sửa

### BaoCaoTienDo
- `BAN_NHAP` - Bản nháp
- `DA_NOP` - Đã nộp
- `QUA_HAN` - Quá hạn
- `DA_NHAN_XET` - Đã nhận xét

### LichBaoVe
- `DU_KIEN` - Dự kiến
- `DA_CONG_BO` - Đã công bố
- `DA_DIEN_RA` - Đã diễn ra
- `HOAN` - Hoãn

## Lưu ý quan trọng

1. **Backup dữ liệu**: Luôn backup trước khi chạy migration
2. **Environment**: Không commit file `.env` lên Git
3. **Prisma Client**: Chạy `npm run prisma:generate` sau mỗi lần thay đổi schema
4. **Foreign Keys**: Các quan hệ đã được thiết lập tự động bởi Prisma
5. **Timestamps**: `ngay_tao` và `ngay_cap_nhat` được tự động quản lý

## Kiểm tra kết nối

Chạy server và truy cập:
```
GET http://localhost:3000/health
```

Response thành công:
```json
{
  "status": "ok",
  "database": "connected"
}
```
