# Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

## Tổng quan
Thành viên 2 phụ trách phát triển chức năng tạo nhóm nghiên cứu, quản lý thành viên nhóm. Đây là bước tiếp theo sau khi sinh viên đã chọn được đề tài phù hợp.

## Phạm vi công việc

### Backend (NodeJS + Prisma + PostgreSQL)

#### 1. Controllers
- `be/src/controllers/nhomNghienCuuController.js` - Xử lý HTTP requests cho nhóm
- `be/src/controllers/sinhVienController.js` - Xử lý HTTP requests cho sinh viên

#### 2. Services
- `be/src/services/nhomNghienCuuService.js` - Logic nghiệp vụ nhóm
- `be/src/services/sinhVienService.js` - Logic nghiệp vụ sinh viên

#### 3. Repositories
- `be/src/repositories/nhomNghienCuuRepository.js` - Truy vấn database nhóm
- `be/src/repositories/sinhVienRepository.js` - Truy vấn database sinh viên

#### 4. Routes
- `be/src/routes/nhomNghienCuu.js` - API endpoints cho nhóm
- `be/src/routes/sinhvien.js` - API endpoints cho sinh viên

### Frontend (React)

#### 1. Components
- `fe/src/components/CreateGroup.js` - Component tạo nhóm (wizard 3 bước)
- `fe/src/components/MemberList.js` - Component danh sách thành viên
- `fe/src/components/AddMemberForm.js` - Component form thêm thành viên

#### 2. Services
- `fe/src/services/api.js` - Thêm groupAPI và studentAPI

#### 3. Styles
- `fe/src/styles/CreateGroup.css`
- `fe/src/styles/MemberList.css`
- `fe/src/styles/AddMemberForm.css`

## API Endpoints

### 1. Tạo nhóm nghiên cứu
```
POST /api/research-groups
Body:
{
  "tenNhom": "Nhóm nghiên cứu AI",
  "truongNhomId": 1,
  "deTaiId": 1
}

Response:
{
  "nhom_id": 1,
  "ma_nhom": "NHOM20240001",
  "ten_nhom": "Nhóm nghiên cứu AI",
  "truong_nhom_id": 1,
  "de_tai_id": 1,
  "so_luong_thanh_vien": 1,
  "trang_thai": "CHO_DUYET",
  ...
}
```

### 2. Lấy chi tiết nhóm
```
GET /api/research-groups/:id

Response:
{
  "nhom_id": 1,
  "ma_nhom": "NHOM20240001",
  "ten_nhom": "...",
  "SinhVien": {...},
  "DeTaiNghienCuu": {...},
  "ThanhVienNhom": [...]
}
```

### 3. Thêm thành viên vào nhóm
```
POST /api/research-groups/:id/members
Body:
{
  "sinhVienId": 2,
  "vaiTro": "THANH_VIEN"
}

Response:
{
  "thanh_vien_nhom_id": 1,
  "nhom_id": 1,
  "sinh_vien_id": 2,
  "vai_tro_trong_nhom": "THANH_VIEN",
  "SinhVien": {...}
}
```

### 4. Xóa thành viên khỏi nhóm
```
DELETE /api/research-groups/:id/members/:studentId

Response:
{
  "message": "Đã xóa thành viên khỏi nhóm"
}
```

### 5. Lấy danh sách thành viên
```
GET /api/research-groups/:id/members

Response:
[
  {
    "thanh_vien_nhom_id": 1,
    "nhom_id": 1,
    "sinh_vien_id": 1,
    "vai_tro_trong_nhom": "TRUONG_NHOM",
    "SinhVien": {...}
  }
]
```

### 6. Tìm kiếm sinh viên
```
GET /api/students/search?keyword=nguyen

Response:
[
  {
    "sinh_vien_id": 1,
    "ma_sinh_vien": "SV001",
    "ho_ten": "Nguyễn Văn An",
    "email": "...",
    "Khoa": {...}
  }
]
```

### 7. Lấy thông tin sinh viên
```
GET /api/students/:id

Response:
{
  "sinh_vien_id": 1,
  "ma_sinh_vien": "SV001",
  "ho_ten": "Nguyễn Văn An",
  ...
}
```

### 8. Kiểm tra điều kiện tham gia nhóm
```
GET /api/students/:id/eligibility

Response:
{
  "eligible": true/false,
  "reason": "..."
}
```

## Luồng hoạt động

### Bước 1: Tạo nhóm
1. Sinh viên nhập tên nhóm
2. Nhập mã sinh viên trưởng nhóm
3. Hệ thống kiểm tra:
   - Sinh viên có tồn tại không
   - Sinh viên đã tham gia nhóm khác chưa
4. Tạo nhóm với mã tự động (NHOM + năm + số thứ tự)
5. Tự động thêm trưởng nhóm vào danh sách thành viên

### Bước 2: Thêm thành viên
1. Hiển thị danh sách thành viên hiện tại
2. Form tìm kiếm sinh viên (theo tên hoặc mã)
3. Chọn sinh viên từ kết quả tìm kiếm
4. Hệ thống kiểm tra:
   - Sinh viên đã trong nhóm chưa
   - Số lượng thành viên đã đạt tối đa chưa
   - Sinh viên có đủ điều kiện không
5. Thêm thành viên vào nhóm
6. Có thể xóa thành viên (trừ trưởng nhóm)

### Bước 3: Xác nhận
1. Hiển thị tổng hợp thông tin nhóm
2. Hiển thị danh sách thành viên
3. Xác nhận và chuyển sang bước tiếp theo (chọn GVHD - Thành viên 3)

## Cài đặt và chạy

### Backend

1. Seed dữ liệu sinh viên:
```bash
cd be
node prisma/seed-thanh-vien-2.js
```

2. Server đã chạy từ Thành viên 1:
```bash
npm start
```

### Frontend

Frontend đã được cấu hình từ Thành viên 1, chỉ cần refresh browser.

## Kiểm thử

### Test Backend API

#### 1. Test tạo nhóm
```bash
curl -X POST http://localhost:3000/api/research-groups \
  -H "Content-Type: application/json" \
  -d '{
    "tenNhom": "Nhóm AI 01",
    "truongNhomId": 1,
    "deTaiId": 1
  }'
```

#### 2. Test lấy chi tiết nhóm
```bash
curl http://localhost:3000/api/research-groups/1
```

#### 3. Test thêm thành viên
```bash
curl -X POST http://localhost:3000/api/research-groups/1/members \
  -H "Content-Type: application/json" \
  -d '{
    "sinhVienId": 2,
    "vaiTro": "THANH_VIEN"
  }'
```

#### 4. Test xóa thành viên
```bash
curl -X DELETE http://localhost:3000/api/research-groups/1/members/2
```

#### 5. Test tìm kiếm sinh viên
```bash
curl "http://localhost:3000/api/students/search?keyword=nguyen"
```

### Test Frontend

1. Mở trình duyệt: http://localhost:3001
2. Chọn một đề tài từ danh sách
3. Click "Đăng ký đề tài này"
4. Điền form tạo nhóm:
   - Tên nhóm: "Nhóm AI 01"
   - Mã sinh viên: 1
5. Click "Tạo nhóm và tiếp tục"
6. Tìm kiếm sinh viên để thêm vào nhóm
7. Thêm 2-3 thành viên
8. Thử xóa một thành viên
9. Click "Tiếp tục"
10. Xem lại thông tin và click "Hoàn thành"

## Validation Rules

### Tạo nhóm
- Tên nhóm: Bắt buộc, không rỗng
- Trưởng nhóm: Phải tồn tại trong database
- Trưởng nhóm: Chưa tham gia nhóm khác
- Đề tài: Phải tồn tại và đang mở đăng ký

### Thêm thành viên
- Sinh viên: Phải tồn tại trong database
- Sinh viên: Chưa có trong nhóm hiện tại
- Sinh viên: Chưa tham gia nhóm khác
- Số lượng: Không vượt quá số lượng tối đa của đề tài

### Xóa thành viên
- Không được xóa trưởng nhóm
- Thành viên phải có trong nhóm

## Tích hợp với các thành viên khác

### Với Thành viên 1 (Danh sách đề tài)
- Nhận topicId từ route parameter
- Hiển thị thông tin đề tài đã chọn
- Kiểm tra số lượng thành viên tối đa

### Với Thành viên 3 (Chọn GVHD)
- Sau khi hoàn thành tạo nhóm, chuyển sang `/select-advisor/:groupId`
- Truyền groupId để chọn giảng viên hướng dẫn

## Cấu trúc dữ liệu

### Bảng nhom_nghien_cuu
- nhom_id (PK)
- ma_nhom (unique)
- ten_nhom
- truong_nhom_id (FK → sinh_vien)
- de_tai_id (FK → de_tai_nghien_cuu)
- giang_vien_huong_dan_id (FK → giang_vien, nullable)
- so_luong_thanh_vien
- trang_thai

### Bảng thanh_vien_nhom
- thanh_vien_nhom_id (PK)
- nhom_id (FK → nhom_nghien_cuu)
- sinh_vien_id (FK → sinh_vien)
- vai_tro_trong_nhom
- ngay_tham_gia
- trang_thai

### Bảng sinh_vien
- sinh_vien_id (PK)
- ma_sinh_vien (unique)
- ho_ten
- email
- khoa_id (FK → khoa)
- lop
- khoa_hoc
- trang_thai

## Trạng thái nhóm
- `CHO_DUYET`: Nhóm mới tạo, chờ phê duyệt
- `DA_DUYET`: Nhóm đã được phê duyệt
- `TU_CHOI`: Nhóm bị từ chối
- `DANG_THUC_HIEN`: Nhóm đang thực hiện đề tài

## Vai trò trong nhóm
- `TRUONG_NHOM`: Trưởng nhóm (người tạo nhóm)
- `THANH_VIEN`: Thành viên thường

## Lưu ý kỹ thuật

1. **Mã nhóm tự động**: Format NHOM + năm + số thứ tự (4 chữ số)
2. **Transaction**: Tạo nhóm và thêm trưởng nhóm phải trong cùng transaction
3. **Validation**: Kiểm tra ở cả frontend và backend
4. **Real-time update**: Sau mỗi thao tác thêm/xóa, reload danh sách thành viên
5. **Error handling**: Hiển thị lỗi rõ ràng cho người dùng

## Checklist hoàn thành

### Backend
- [x] Controller cho nhóm nghiên cứu
- [x] Controller cho sinh viên
- [x] Service cho nhóm nghiên cứu
- [x] Service cho sinh viên
- [x] Repository cho nhóm nghiên cứu
- [x] Repository cho sinh viên
- [x] Routes cho nhóm nghiên cứu
- [x] Routes cho sinh viên
- [x] Validation logic

### Frontend
- [x] Component CreateGroup
- [x] Component MemberList
- [x] Component AddMemberForm
- [x] API Service (groupAPI, studentAPI)
- [x] Styles cho tất cả components
- [x] Wizard 3 bước
- [x] Tích hợp React Router

### Testing
- [ ] Test API với Postman/curl
- [ ] Test UI trên trình duyệt
- [ ] Test tạo nhóm
- [ ] Test thêm/xóa thành viên
- [ ] Test validation
- [ ] Test tích hợp với Thành viên 1

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Đã seed dữ liệu sinh viên chưa
2. Backend server đang chạy
3. Frontend đã refresh sau khi thêm code
4. Console browser có lỗi không
5. Network tab có request/response đúng không

## Tài liệu tham khảo
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [React Hooks](https://react.dev/reference/react)
- [React Router](https://reactrouter.com)
