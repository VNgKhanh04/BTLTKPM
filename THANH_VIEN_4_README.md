# Thành viên 4: Màn hình nộp hồ sơ đăng ký đề tài

## 📋 Tổng quan

Thành viên 4 phụ trách phát triển chức năng nộp hồ sơ đăng ký đề tài, bao gồm:
- Tổng hợp thông tin đề tài + nhóm + giảng viên
- Review hồ sơ trước khi nộp
- Nộp hồ sơ đăng ký
- Xem trạng thái hồ sơ
- Theo dõi timeline xử lý

---

## 🎯 Chức năng đã triển khai

### Backend (Node.js + Prisma)

#### 1. Controllers (`be/src/controllers/hoSoDangKyController.js`)
- ✅ `taoHoSoDangKy()` - Tạo hồ sơ đăng ký
- ✅ `getChiTietHoSo()` - Lấy chi tiết hồ sơ
- ✅ `getDanhSachHoSo()` - Lấy danh sách hồ sơ
- ✅ `capNhatHoSo()` - Cập nhật hồ sơ
- ✅ `xacNhanNopHoSo()` - Xác nhận nộp hồ sơ
- ✅ `getTimeline()` - Lấy timeline trạng thái

#### 2. Services (`be/src/services/hoSoDangKyService.js`)
- ✅ `taoHoSoDangKy()` - Logic tạo hồ sơ với validation
- ✅ `getChiTietHoSo()` - Logic lấy chi tiết
- ✅ `getDanhSachHoSo()` - Logic lấy danh sách với filter
- ✅ `capNhatHoSo()` - Logic cập nhật với kiểm tra trạng thái
- ✅ `xacNhanNopHoSo()` - Logic xác nhận nộp
- ✅ `getTimeline()` - Logic tạo timeline từ lịch sử phê duyệt

#### 3. Repositories (`be/src/repositories/hoSoDangKyRepository.js`)
- ✅ `findMany()` - Query danh sách với filter
- ✅ `findById()` - Query chi tiết với relations
- ✅ `findByTopic()` - Query theo đề tài
- ✅ `checkGroupRegistered()` - Kiểm tra nhóm đã đăng ký
- ✅ `create()` - Tạo hồ sơ mới
- ✅ `update()` - Cập nhật hồ sơ
- ✅ `getApprovalHistory()` - Lấy lịch sử phê duyệt

#### 4. Routes (`be/src/routes/hoSoDangKy.js`)
- ✅ `POST /api/topic-registrations` - Tạo hồ sơ
- ✅ `GET /api/topic-registrations` - Lấy danh sách
- ✅ `GET /api/topic-registrations/:id` - Lấy chi tiết
- ✅ `PUT /api/topic-registrations/:id` - Cập nhật
- ✅ `PATCH /api/topic-registrations/:id/submit` - Xác nhận nộp
- ✅ `GET /api/topic-registrations/:id/timeline` - Lấy timeline

### Frontend (React)

#### 1. Components

**RegistrationReview.js** - Component review hồ sơ
- ✅ Hiển thị tổng hợp thông tin đề tài, nhóm, giảng viên
- ✅ Form nhập lý do chọn đề tài
- ✅ Validation trước khi nộp
- ✅ Submit hồ sơ đăng ký
- ✅ Loading và error states

**RegistrationStatus.js** - Component trạng thái hồ sơ
- ✅ Hiển thị trạng thái hồ sơ với badge màu sắc
- ✅ Hiển thị thông tin chi tiết hồ sơ
- ✅ Timeline lịch sử xử lý
- ✅ Ghi chú từ giảng viên (nếu có)
- ✅ Actions theo trạng thái

#### 2. Services (`fe/src/services/api.js`)
- ✅ `registrationAPI.create()` - Tạo hồ sơ
- ✅ `registrationAPI.getById()` - Lấy chi tiết
- ✅ `registrationAPI.getList()` - Lấy danh sách
- ✅ `registrationAPI.update()` - Cập nhật
- ✅ `registrationAPI.submit()` - Xác nhận nộp
- ✅ `registrationAPI.getTimeline()` - Lấy timeline

#### 3. Styles
- ✅ `RegistrationReview.css` - Styles cho review
- ✅ `RegistrationStatus.css` - Styles cho status

#### 4. Routing (`fe/src/App.js`)
- ✅ Route `/register-topic/:topicId/review/:groupId` - Review hồ sơ
- ✅ Route `/registration-status/:registrationId` - Trạng thái hồ sơ

---

## 🗂️ Cấu trúc file

```
be/
├── src/
│   ├── controllers/
│   │   └── hoSoDangKyController.js         ✅ Controller
│   ├── services/
│   │   └── hoSoDangKyService.js            ✅ Business logic
│   ├── repositories/
│   │   └── hoSoDangKyRepository.js         ✅ Database queries
│   └── routes/
│       └── hoSoDangKy.js                   ✅ Routes
└── prisma/
    └── seed-thanh-vien-4.js                ✅ Seed data

fe/
├── src/
│   ├── components/
│   │   ├── RegistrationReview.js           ✅ Component review
│   │   └── RegistrationStatus.js           ✅ Component status
│   ├── services/
│   │   └── api.js                          ✅ (registrationAPI added)
│   └── styles/
│       ├── RegistrationReview.css          ✅ Styles review
│       └── RegistrationStatus.css          ✅ Styles status
```

---

## 🚀 Hướng dẫn chạy

### 1. Chuẩn bị dữ liệu

Chạy seed data (sau khi đã chạy seed của Thành viên 1, 2, 3):

```bash
cd be
node prisma/seed-thanh-vien-4.js
```

### 2. Khởi động Backend

```bash
cd be
npm start
```

### 3. Khởi động Frontend

```bash
cd fe
npm start
```

---

## 📡 API Endpoints

### 1. POST /api/topic-registrations - Tạo hồ sơ

Request Body:
```json
{
  "nhomId": 1,
  "deTaiId": 1,
  "lyDoChonDeTai": "Lý do chọn đề tài...",
  "nguoiTaoId": 1
}
```

Response:
```json
{
  "ho_so_id": 1,
  "nhom_id": 1,
  "de_tai_id": 1,
  "ly_do_chon_de_tai": "Lý do...",
  "trang_thai": "CHO_PHE_DUYET",
  "ngay_dang_ky": "2024-03-29T..."
}
```

### 2. GET /api/topic-registrations/:id - Chi tiết hồ sơ

Response:
```json
{
  "ho_so_id": 1,
  "nhom_id": 1,
  "de_tai_id": 1,
  "trang_thai": "CHO_PHE_DUYET",
  "NhomNghienCuu": { ... },
  "DeTaiNghienCuu": { ... },
  "PheDuyetDeTai": [ ... ]
}
```

### 3. GET /api/topic-registrations - Danh sách hồ sơ

Query Params:
- `studentId` - Lọc theo sinh viên
- `nhomId` - Lọc theo nhóm
- `trangThai` - Lọc theo trạng thái

### 4. PATCH /api/topic-registrations/:id/submit - Xác nhận nộp

Response:
```json
{
  "ho_so_id": 1,
  "trang_thai": "DA_NOP"
}
```

---

## 🎨 Giao diện người dùng

### Luồng sử dụng

1. **Từ màn hình chọn giảng viên** (Thành viên 3)
   - Sau khi chọn giảng viên xong
   - Click "Chọn giảng viên" → Chuyển sang màn hình review

2. **Màn hình Review hồ sơ**
   - Hiển thị tổng hợp:
     - Thông tin đề tài
     - Thông tin nhóm và danh sách thành viên
     - Thông tin giảng viên hướng dẫn
   - Form nhập lý do chọn đề tài
   - Button "Xác nhận nộp hồ sơ"

3. **Nộp hồ sơ**
   - Validation: Kiểm tra lý do đã nhập
   - Validation: Kiểm tra đã có giảng viên
   - Gọi API tạo hồ sơ
   - Chuyển sang màn hình trạng thái

4. **Màn hình Trạng thái hồ sơ**
   - Badge trạng thái với màu sắc
   - Thông tin chi tiết hồ sơ
   - Timeline lịch sử xử lý
   - Actions: Về trang chủ, Chỉnh sửa (nếu cần)

### Trạng thái hồ sơ

| Trạng thái | Màu | Icon | Mô tả |
|------------|-----|------|-------|
| CHO_PHE_DUYET | Warning (Vàng) | ⏳ | Chờ phê duyệt |
| DA_NOP | Info (Xanh dương) | 📝 | Đã nộp |
| DA_DUYET | Success (Xanh lá) | ✅ | Đã duyệt |
| TU_CHOI | Danger (Đỏ) | ❌ | Từ chối |
| CAN_CHINH_SUA | Warning (Vàng) | ✏️ | Cần chỉnh sửa |

---

## 🔍 Validation và Business Rules

### Backend Validation

1. **Kiểm tra nhóm tồn tại**
   - Error: "Không tìm thấy nhóm"

2. **Kiểm tra đề tài tồn tại**
   - Error: "Không tìm thấy đề tài"

3. **Kiểm tra nhóm đã đăng ký**
   - Một nhóm chỉ được đăng ký một đề tài
   - Error: "Nhóm đã đăng ký đề tài khác"

4. **Kiểm tra trạng thái khi cập nhật**
   - Không cho phép cập nhật hồ sơ đã duyệt
   - Error: "Không thể cập nhật hồ sơ đã được duyệt"

### Frontend Validation

1. **Lý do chọn đề tài**
   - Bắt buộc nhập
   - Tối thiểu 50 ký tự (khuyến nghị)

2. **Giảng viên hướng dẫn**
   - Phải đã chọn giảng viên
   - Button disabled nếu chưa có

---

## 🔗 Tích hợp với các thành viên khác

### Input từ Thành viên 1, 2, 3

- Đề tài (Thành viên 1)
- Nhóm với thành viên (Thành viên 2)
- Giảng viên hướng dẫn (Thành viên 3)

### Output cho Thành viên 5

- Hồ sơ đăng ký hoàn chỉnh
- Trạng thái cần validation
- Thông báo cần gửi

---

## 🧪 Test với cURL

```bash
# Tạo hồ sơ
curl -X POST http://localhost:3000/api/topic-registrations \
  -H "Content-Type: application/json" \
  -d '{
    "nhomId": 1,
    "deTaiId": 1,
    "lyDoChonDeTai": "Lý do chọn đề tài này...",
    "nguoiTaoId": 1
  }'

# Lấy chi tiết
curl http://localhost:3000/api/topic-registrations/1

# Lấy danh sách
curl "http://localhost:3000/api/topic-registrations?nhomId=1"

# Xác nhận nộp
curl -X PATCH http://localhost:3000/api/topic-registrations/1/submit

# Lấy timeline
curl http://localhost:3000/api/topic-registrations/1/timeline
```

---

## ✅ Checklist hoàn thành

### Backend
- [x] Controller: hoSoDangKyController.js
- [x] Service: hoSoDangKyService.js
- [x] Repository: hoSoDangKyRepository.js
- [x] Routes: hoSoDangKy.js
- [x] Seed data: seed-thanh-vien-4.js
- [x] Integration: index.js

### Frontend
- [x] Component: RegistrationReview.js
- [x] Component: RegistrationStatus.js
- [x] Service: api.js (registrationAPI)
- [x] Styles: RegistrationReview.css
- [x] Styles: RegistrationStatus.css
- [x] Routing: App.js
- [x] Integration: LecturerList navigation

### Documentation
- [x] README: THANH_VIEN_4_README.md

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Manual testing

---

**Hoàn thành:** 29/03/2024
**Người thực hiện:** Kiro AI Assistant
