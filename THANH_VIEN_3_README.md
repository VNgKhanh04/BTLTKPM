# Thành viên 3: Màn hình chọn giảng viên hướng dẫn

## 📋 Tổng quan

Thành viên 3 phụ trách phát triển chức năng chọn giảng viên hướng dẫn cho nhóm nghiên cứu, bao gồm:
- Hiển thị danh sách giảng viên có thể hướng dẫn
- Tìm kiếm và lọc giảng viên theo chuyên môn
- Kiểm tra quota hướng dẫn của giảng viên
- Gán giảng viên hướng dẫn cho nhóm

---

## 🎯 Chức năng đã triển khai

### Backend (Node.js + Prisma)

#### 1. Controllers (`be/src/controllers/giangVienController.js`)
- ✅ `getDanhSachGiangVien()` - Lấy danh sách giảng viên với filter
- ✅ `getChiTietGiangVien()` - Lấy chi tiết giảng viên
- ✅ `kiemTraQuota()` - Kiểm tra quota hướng dẫn
- ✅ `ganGiangVienHuongDan()` - Gán giảng viên cho nhóm

#### 2. Services (`be/src/services/giangVienService.js`)
- ✅ `getDanhSachGiangVien()` - Logic lấy danh sách với filter
- ✅ `getChiTietGiangVien()` - Logic lấy chi tiết + số lượng đang hướng dẫn
- ✅ `kiemTraQuota()` - Logic kiểm tra quota và tính số chỗ còn lại
- ✅ `ganGiangVienHuongDan()` - Logic gán giảng viên với validation

#### 3. Repositories (`be/src/repositories/giangVienRepository.js`)
- ✅ `findMany()` - Query danh sách với filter (specialization, keyword)
- ✅ `findById()` - Query chi tiết với relations
- ✅ `countCurrentlySupervising()` - Đếm số nhóm đang hướng dẫn
- ✅ `create()` - Tạo giảng viên mới
- ✅ `update()` - Cập nhật thông tin giảng viên

#### 4. Routes (`be/src/routes/giangVien.js`)
- ✅ `GET /api/lecturers` - Lấy danh sách giảng viên
- ✅ `GET /api/lecturers/:id` - Lấy chi tiết giảng viên
- ✅ `GET /api/lecturers/:id/quota` - Kiểm tra quota
- ✅ `PUT /api/research-groups/:id/advisor` - Gán giảng viên (trong nhomNghienCuu.js)

### Frontend (React)

#### 1. Components

**LecturerList.js** - Component chính
- ✅ Hiển thị danh sách giảng viên dạng grid
- ✅ Form tìm kiếm theo keyword và chuyên môn
- ✅ Fetch và hiển thị quota cho từng giảng viên
- ✅ Hiển thị thông tin nhóm đang đăng ký
- ✅ Xử lý chọn giảng viên và gán cho nhóm
- ✅ Loading và error states

**LecturerCard.js** - Card hiển thị giảng viên
- ✅ Hiển thị thông tin cơ bản (tên, mã, email, SĐT)
- ✅ Hiển thị khoa và chuyên môn
- ✅ Hiển thị quota (đang hướng dẫn / tối đa)
- ✅ Badge trạng thái (còn chỗ / đã đủ quota)
- ✅ Button chọn giảng viên (disabled nếu đã đủ quota)

#### 2. Services (`fe/src/services/api.js`)
- ✅ `lecturerAPI.getList()` - Lấy danh sách với params
- ✅ `lecturerAPI.getById()` - Lấy chi tiết
- ✅ `lecturerAPI.checkQuota()` - Kiểm tra quota
- ✅ `lecturerAPI.assignToGroup()` - Gán giảng viên cho nhóm

#### 3. Styles
- ✅ `LecturerList.css` - Styles cho danh sách
- ✅ `LecturerCard.css` - Styles cho card giảng viên

#### 4. Routing (`fe/src/App.js`)
- ✅ Route `/select-lecturer/:groupId` - Màn hình chọn giảng viên

---

## 🗂️ Cấu trúc file

```
be/
├── src/
│   ├── controllers/
│   │   └── giangVienController.js          ✅ Controller xử lý request
│   ├── services/
│   │   └── giangVienService.js             ✅ Business logic
│   ├── repositories/
│   │   ├── giangVienRepository.js          ✅ Database queries
│   │   └── nhomNghienCuuRepository.js      ✅ (assignAdvisor method)
│   └── routes/
│       ├── giangVien.js                    ✅ Routes giảng viên
│       └── nhomNghienCuu.js                ✅ (PUT advisor endpoint)
└── prisma/
    └── seed-thanh-vien-3.js                ✅ Seed data giảng viên

fe/
├── src/
│   ├── components/
│   │   ├── LecturerList.js                 ✅ Component danh sách
│   │   └── LecturerCard.js                 ✅ Component card
│   ├── services/
│   │   └── api.js                          ✅ (lecturerAPI added)
│   └── styles/
│       ├── LecturerList.css                ✅ Styles danh sách
│       └── LecturerCard.css                ✅ Styles card
```

---

## 🚀 Hướng dẫn chạy

### 1. Chuẩn bị dữ liệu

Chạy seed data để tạo giảng viên mẫu:

```bash
cd be
node prisma/seed-thanh-vien-3.js
```

Kết quả:
- 12 giảng viên (8 khoa CNTT, 2 khoa KT, 2 khoa NN)
- Các giảng viên có chuyên môn khác nhau
- Quota hướng dẫn từ 4-6 nhóm/giảng viên
- Một số đề tài đã được gán giảng viên

### 2. Khởi động Backend

```bash
cd be
npm start
```

Server chạy tại: http://localhost:3000

### 3. Khởi động Frontend

```bash
cd fe
npm start
```

App chạy tại: http://localhost:3001

---

## 📡 API Endpoints

### 1. Lấy danh sách giảng viên

**GET** `/api/lecturers`

Query Parameters:
- `keyword` (optional) - Tìm theo tên, mã GV, email
- `specialization` (optional) - Lọc theo chuyên môn

Response:
```json
[
  {
    "giang_vien_id": 1,
    "ma_giang_vien": "GV001",
    "ho_ten": "TS. Nguyễn Văn An",
    "email": "nva@university.edu.vn",
    "so_dien_thoai": "0901234567",
    "khoa_id": 1,
    "chuyen_mon": "Trí tuệ nhân tạo, Machine Learning",
    "so_luong_huong_dan_toi_da": 5,
    "trang_thai": 1,
    "Khoa": {
      "khoa_id": 1,
      "ten_khoa": "Công nghệ thông tin"
    }
  }
]
```

### 2. Lấy chi tiết giảng viên

**GET** `/api/lecturers/:id`

Response:
```json
{
  "giang_vien_id": 1,
  "ma_giang_vien": "GV001",
  "ho_ten": "TS. Nguyễn Văn An",
  "email": "nva@university.edu.vn",
  "chuyen_mon": "Trí tuệ nhân tạo, Machine Learning",
  "so_luong_huong_dan_toi_da": 5,
  "so_luong_dang_huong_dan": 2,
  "Khoa": { ... },
  "DeTaiNghienCuu": [...],
  "NhomNghienCuu": [...]
}
```

### 3. Kiểm tra quota hướng dẫn

**GET** `/api/lecturers/:id/quota`

Response:
```json
{
  "giang_vien_id": 1,
  "ho_ten": "TS. Nguyễn Văn An",
  "so_luong_toi_da": 5,
  "so_luong_dang_huong_dan": 2,
  "con_cho": 3,
  "co_the_nhan_them": true
}
```

### 4. Gán giảng viên hướng dẫn cho nhóm

**PUT** `/api/research-groups/:id/advisor`

Request Body:
```json
{
  "giangVienId": 1
}
```

Response:
```json
{
  "nhom_id": 1,
  "ma_nhom": "NHOM2024001",
  "ten_nhom": "Nhóm AI Research",
  "giang_vien_huong_dan_id": 1,
  "GiangVien": {
    "ho_ten": "TS. Nguyễn Văn An"
  }
}
```

---

## 🧪 Test API với cURL

### 1. Lấy danh sách giảng viên

```bash
# Tất cả giảng viên
curl http://localhost:3000/api/lecturers

# Tìm theo keyword
curl "http://localhost:3000/api/lecturers?keyword=Nguyễn"

# Lọc theo chuyên môn
curl "http://localhost:3000/api/lecturers?specialization=Machine%20Learning"

# Kết hợp cả hai
curl "http://localhost:3000/api/lecturers?keyword=TS&specialization=AI"
```

### 2. Lấy chi tiết giảng viên

```bash
curl http://localhost:3000/api/lecturers/1
```

### 3. Kiểm tra quota

```bash
curl http://localhost:3000/api/lecturers/1/quota
```

### 4. Gán giảng viên cho nhóm

```bash
curl -X PUT http://localhost:3000/api/research-groups/1/advisor \
  -H "Content-Type: application/json" \
  -d '{"giangVienId": 1}'
```

---

## 🎨 Giao diện người dùng

### Luồng sử dụng

1. **Từ màn hình tạo nhóm** (Thành viên 2)
   - Sau khi tạo nhóm và thêm thành viên xong
   - Click "Tiếp theo" → Chuyển sang màn hình chọn giảng viên

2. **Màn hình chọn giảng viên**
   - Hiển thị thông tin nhóm và đề tài đang đăng ký
   - Form tìm kiếm theo tên/email và chuyên môn
   - Danh sách giảng viên dạng grid cards
   - Mỗi card hiển thị:
     - Thông tin cơ bản (tên, mã, email, SĐT)
     - Khoa và chuyên môn
     - Quota (X/Y đang hướng dẫn)
     - Badge trạng thái (còn chỗ / đã đủ)
     - Button chọn (disabled nếu đã đủ quota)

3. **Chọn giảng viên**
   - Click "Chọn giảng viên" trên card
   - Hệ thống kiểm tra quota
   - Gán giảng viên cho nhóm
   - Hiển thị thông báo thành công
   - Chuyển sang bước tiếp theo (Thành viên 4)

### Tính năng UI

- ✅ Responsive design (desktop + mobile)
- ✅ Loading states
- ✅ Error handling
- ✅ Search và filter real-time
- ✅ Visual feedback (hover, disabled states)
- ✅ Color-coded quota status
- ✅ Smooth transitions

---

## 🔍 Validation và Business Rules

### Backend Validation

1. **Kiểm tra nhóm tồn tại**
   - Nhóm phải tồn tại trong database
   - Error: "Không tìm thấy nhóm"

2. **Kiểm tra giảng viên tồn tại**
   - Giảng viên phải tồn tại và active
   - Error: "Không tìm thấy giảng viên"

3. **Kiểm tra quota**
   - Số lượng đang hướng dẫn < số lượng tối đa
   - Error: "Giảng viên đã đủ số lượng hướng dẫn"

4. **Tính quota**
   - Chỉ đếm nhóm có trạng thái: CHO_DUYET, DANG_THUC_HIEN
   - Không đếm nhóm đã HOAN_THANH hoặc HUY

### Frontend Validation

1. **Visual indicators**
   - Badge màu xanh: Còn chỗ
   - Badge màu đỏ: Đã đủ quota
   - Button disabled khi đã đủ quota

2. **User feedback**
   - Loading spinner khi fetch data
   - Error messages rõ ràng
   - Success notification sau khi gán

---

## 📊 Database Schema

### Bảng GiangVien

```sql
CREATE TABLE giang_vien (
  giang_vien_id              SERIAL PRIMARY KEY,
  ma_giang_vien              VARCHAR(20) UNIQUE NOT NULL,
  ho_ten                     VARCHAR(100) NOT NULL,
  email                      VARCHAR(100) UNIQUE NOT NULL,
  so_dien_thoai              VARCHAR(15),
  khoa_id                    INTEGER NOT NULL,
  chuyen_mon                 VARCHAR(255),
  so_luong_huong_dan_toi_da  INTEGER DEFAULT 0,
  trang_thai                 SMALLINT DEFAULT 1,
  ngay_tao                   TIMESTAMP DEFAULT NOW(),
  ngay_cap_nhat              TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (khoa_id) REFERENCES khoa(khoa_id)
);
```

### Relations

- `GiangVien` → `Khoa` (many-to-one)
- `GiangVien` → `DeTaiNghienCuu` (one-to-many)
- `GiangVien` → `NhomNghienCuu` (one-to-many)

---

## 🔗 Tích hợp với các thành viên khác

### Thành viên 2 (Tạo nhóm)

**Input từ Thành viên 2:**
- `groupId` - ID của nhóm vừa tạo
- Nhóm đã có thành viên
- Nhóm đã được gán đề tài

**Output cho Thành viên 2:**
- Cập nhật `giang_vien_huong_dan_id` trong bảng `nhom_nghien_cuu`
- Navigate về màn hình review hoặc tiếp theo

### Thành viên 4 (Nộp hồ sơ)

**Output cho Thành viên 4:**
- Nhóm đã có đầy đủ thông tin:
  - Đề tài
  - Thành viên
  - Giảng viên hướng dẫn
- Sẵn sàng để tạo hồ sơ đăng ký

---

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **"Không thể tải danh sách giảng viên"**
   - Kiểm tra backend đang chạy
   - Kiểm tra CORS configuration
   - Kiểm tra database connection

2. **"Giảng viên đã đủ số lượng hướng dẫn"**
   - Giảng viên đã đạt quota tối đa
   - Chọn giảng viên khác
   - Hoặc admin tăng quota cho giảng viên

3. **Quota không hiển thị đúng**
   - Kiểm tra logic đếm trong `countCurrentlySupervising()`
   - Kiểm tra trạng thái nhóm (chỉ đếm CHO_DUYET, DANG_THUC_HIEN)

4. **Search không hoạt động**
   - Kiểm tra query parameters
   - Kiểm tra Prisma filter syntax
   - Kiểm tra case-insensitive mode

---

## ✅ Checklist hoàn thành

### Backend
- [x] Controller: giangVienController.js
- [x] Service: giangVienService.js
- [x] Repository: giangVienRepository.js
- [x] Routes: giangVien.js
- [x] Update: nhomNghienCuu.js (PUT advisor endpoint)
- [x] Seed data: seed-thanh-vien-3.js
- [x] Integration: index.js

### Frontend
- [x] Component: LecturerList.js
- [x] Component: LecturerCard.js
- [x] Service: api.js (lecturerAPI)
- [x] Styles: LecturerList.css
- [x] Styles: LecturerCard.css
- [x] Routing: App.js
- [x] Integration: CreateGroup.js navigation

### Documentation
- [x] README: THANH_VIEN_3_README.md
- [x] API Documentation
- [x] User Guide

### Testing
- [ ] Unit tests cho services
- [ ] Integration tests cho API
- [ ] Component tests cho React
- [ ] E2E tests cho user flow
- [ ] Manual testing

---

## 📝 Ghi chú

### Điểm mạnh

1. **Validation đầy đủ**
   - Kiểm tra quota trước khi gán
   - Kiểm tra tồn tại nhóm và giảng viên
   - Visual feedback rõ ràng

2. **UX tốt**
   - Search và filter linh hoạt
   - Hiển thị quota trực quan
   - Disabled state cho giảng viên đã đủ quota

3. **Performance**
   - Parallel fetch quota cho nhiều giảng viên
   - Efficient database queries
   - Proper indexing

### Cải tiến có thể làm

1. **Pagination**
   - Hiện tại load tất cả giảng viên
   - Nên thêm pagination nếu số lượng lớn

2. **Advanced filters**
   - Filter theo khoa
   - Filter theo số chỗ còn lại
   - Sort theo tên, quota

3. **Recommendation system**
   - Gợi ý giảng viên phù hợp với đề tài
   - Dựa trên chuyên môn và lĩnh vực

4. **Real-time updates**
   - WebSocket để cập nhật quota real-time
   - Khi giảng viên được gán bởi nhóm khác

---

## 🎓 Kiến thức áp dụng

### Backend
- Layered Architecture (Controller → Service → Repository)
- Prisma ORM với relations
- RESTful API design
- Error handling
- Business logic validation

### Frontend
- React Hooks (useState, useEffect)
- React Router (useParams, useNavigate)
- Fetch API
- Component composition
- CSS Grid layout
- Responsive design

---

## 📞 Liên hệ

Nếu có vấn đề hoặc câu hỏi về phần Thành viên 3, vui lòng liên hệ hoặc tham khảo:
- [API_DOCUMENTATION.md](./be/API_DOCUMENTATION.md)
- [PROJECT_STRUCTURE.md](./be/PROJECT_STRUCTURE.md)
- [DEVELOPMENT_GUIDE.md](./be/DEVELOPMENT_GUIDE.md)

---

**Hoàn thành:** 29/03/2024
**Người thực hiện:** Kiro AI Assistant
