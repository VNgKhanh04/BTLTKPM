# Cấu trúc dự án Backend - Hệ thống Quản lý Nghiên cứu Khoa học

## Tổng quan kiến trúc

Dự án được xây dựng theo mô hình **Layered Architecture** với 3 tầng chính:

```
┌─────────────────────────────────────┐
│   Presentation Layer (Controllers)  │  ← Tiếp nhận request, trả response
├─────────────────────────────────────┤
│   Application Layer (Services)      │  ← Xử lý nghiệp vụ, logic
├─────────────────────────────────────┤
│   Data Layer (Repositories)         │  ← Truy vấn database
└─────────────────────────────────────┘
```

## Cấu trúc thư mục

```
be/
├── prisma/
│   └── schema.prisma              # Schema database Prisma
├── src/
│   ├── config/
│   │   └── prisma.js              # Cấu hình Prisma Client
│   │
│   ├── controllers/               # Presentation Layer
│   │   ├── deTaiController.js           # Thành viên 1
│   │   ├── linhVucController.js         # Thành viên 1
│   │   ├── nhomNghienCuuController.js   # Thành viên 2
│   │   ├── sinhVienController.js        # Thành viên 2
│   │   ├── giangVienController.js       # Thành viên 3
│   │   ├── hoSoDangKyController.js      # Thành viên 4
│   │   ├── validationController.js      # Thành viên 5
│   │   └── thongBaoController.js        # Thành viên 5
│   │
│   ├── services/                  # Application Layer
│   │   ├── deTaiService.js              # Thành viên 1
│   │   ├── linhVucService.js            # Thành viên 1
│   │   ├── nhomNghienCuuService.js      # Thành viên 2
│   │   ├── sinhVienService.js           # Thành viên 2
│   │   ├── giangVienService.js          # Thành viên 3
│   │   ├── hoSoDangKyService.js         # Thành viên 4
│   │   ├── validationService.js         # Thành viên 5
│   │   └── thongBaoService.js           # Thành viên 5
│   │
│   ├── repositories/              # Data Layer
│   │   ├── deTaiRepository.js           # Thành viên 1
│   │   ├── linhVucRepository.js         # Thành viên 1
│   │   ├── nhomNghienCuuRepository.js   # Thành viên 2
│   │   ├── sinhVienRepository.js        # Thành viên 2
│   │   ├── giangVienRepository.js       # Thành viên 3
│   │   ├── hoSoDangKyRepository.js      # Thành viên 4
│   │   └── thongBaoRepository.js        # Thành viên 5
│   │
│   ├── routes/                    # Định tuyến API
│   │   ├── deTai.js                     # Thành viên 1
│   │   ├── linhVuc.js                   # Thành viên 1
│   │   ├── nhomNghienCuu.js             # Thành viên 2
│   │   ├── sinhvien.js                  # Thành viên 2
│   │   ├── giangVien.js                 # Thành viên 3
│   │   ├── hoSoDangKy.js                # Thành viên 4
│   │   ├── validation.js                # Thành viên 5
│   │   └── thongBao.js                  # Thành viên 5
│   │
│   ├── middlewares/               # Middleware
│   │   ├── errorHandler.js              # Xử lý lỗi tập trung
│   │   ├── validateRequest.js           # Validate request
│   │   └── asyncHandler.js              # Xử lý async/await
│   │
│   ├── utils/                     # Utilities
│   │   ├── constants.js                 # Hằng số hệ thống
│   │   └── responseFormatter.js         # Format response
│   │
│   └── index.js                   # Entry point
│
├── .env                           # Biến môi trường
├── package.json                   # Dependencies
└── PROJECT_STRUCTURE.md           # File này
```

## Phân công theo thành viên

### Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

**Chức năng:**
- Hiển thị danh sách đề tài đang mở đăng ký
- Tìm kiếm đề tài theo tên
- Lọc đề tài theo lĩnh vực
- Xem chi tiết đề tài
- Kiểm tra đề tài còn khả năng đăng ký

**API Endpoints:**
- `GET /api/topics` - Lấy danh sách đề tài (có phân trang, tìm kiếm, lọc)
- `GET /api/topics/:id` - Lấy chi tiết đề tài
- `GET /api/topics/:id/availability` - Kiểm tra khả năng đăng ký
- `GET /api/fields` - Lấy danh sách lĩnh vực

**Files:**
- Controllers: `deTaiController.js`, `linhVucController.js`
- Services: `deTaiService.js`, `linhVucService.js`
- Repositories: `deTaiRepository.js`, `linhVucRepository.js`
- Routes: `deTai.js`, `linhVuc.js`

---

### Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

**Chức năng:**
- Tạo nhóm nghiên cứu
- Chọn trưởng nhóm
- Thêm/xóa thành viên nhóm
- Kiểm tra số lượng thành viên tối đa
- Kiểm tra sinh viên có đủ điều kiện tham gia

**API Endpoints:**
- `POST /api/research-groups` - Tạo nhóm nghiên cứu
- `GET /api/research-groups/:id` - Xem chi tiết nhóm
- `POST /api/research-groups/:id/members` - Thêm thành viên
- `DELETE /api/research-groups/:id/members/:studentId` - Xóa thành viên
- `GET /api/research-groups/:id/members` - Lấy danh sách thành viên
- `GET /api/students/search?keyword=` - Tìm sinh viên

**Files:**
- Controllers: `nhomNghienCuuController.js`, `sinhVienController.js`
- Services: `nhomNghienCuuService.js`, `sinhVienService.js`
- Repositories: `nhomNghienCuuRepository.js`, `sinhVienRepository.js`
- Routes: `nhomNghienCuu.js`, `sinhvien.js`

---

### Thành viên 3: Màn hình chọn giảng viên hướng dẫn

**Chức năng:**
- Hiển thị danh sách giảng viên có thể hướng dẫn
- Tìm giảng viên theo tên hoặc chuyên môn
- Kiểm tra quota hướng dẫn
- Chọn giảng viên phù hợp cho đề tài
- Cảnh báo khi giảng viên đã đủ quota

**API Endpoints:**
- `GET /api/lecturers` - Lấy danh sách giảng viên
- `GET /api/lecturers/:id` - Lấy chi tiết giảng viên
- `GET /api/lecturers/:id/quota` - Kiểm tra quota hướng dẫn
- `PUT /api/research-groups/:id/advisor` - Gán giảng viên hướng dẫn

**Files:**
- Controllers: `giangVienController.js`
- Services: `giangVienService.js`
- Repositories: `giangVienRepository.js`
- Routes: `giangVien.js`

---

### Thành viên 4: Màn hình nộp hồ sơ đăng ký đề tài

**Chức năng:**
- Tổng hợp thông tin đề tài + nhóm + giảng viên
- Nộp hồ sơ đăng ký đề tài
- Lưu trạng thái hồ sơ
- Xem lại thông tin hồ sơ đã nộp
- Cập nhật hồ sơ trước khi được duyệt

**API Endpoints:**
- `POST /api/topic-registrations` - Tạo hồ sơ đăng ký
- `GET /api/topic-registrations/:id` - Xem chi tiết hồ sơ
- `GET /api/topic-registrations?studentId=` - Xem danh sách hồ sơ
- `PUT /api/topic-registrations/:id` - Cập nhật hồ sơ
- `PATCH /api/topic-registrations/:id/submit` - Xác nhận nộp hồ sơ
- `GET /api/topic-registrations/:id/timeline` - Lấy timeline trạng thái

**Files:**
- Controllers: `hoSoDangKyController.js`
- Services: `hoSoDangKyService.js`
- Repositories: `hoSoDangKyRepository.js`
- Routes: `hoSoDangKy.js`

---

### Thành viên 5: Kiểm tra điều kiện đăng ký, thông báo và xử lý lỗi

**Chức năng:**
- Kiểm tra trùng lặp đề tài
- Kiểm tra dữ liệu đầu vào hợp lệ
- Gửi thông báo khi đăng ký thành công/thất bại
- Chuẩn hóa message lỗi
- Xử lý lỗi tập trung

**API Endpoints:**
- `POST /api/topic-registrations/validate` - Kiểm tra tính hợp lệ
- `GET /api/notifications` - Lấy danh sách thông báo
- `POST /api/notifications` - Tạo thông báo
- `PATCH /api/notifications/:id/read` - Đánh dấu đã đọc
- `GET /api/topic-registrations/:id/errors` - Lấy danh sách lỗi

**Files:**
- Controllers: `validationController.js`, `thongBaoController.js`
- Services: `validationService.js`, `thongBaoService.js`
- Repositories: `thongBaoRepository.js`
- Routes: `validation.js`, `thongBao.js`
- Middlewares: `errorHandler.js`, `validateRequest.js`, `asyncHandler.js`

---

## Luồng xử lý request

```
Request → Route → Controller → Service → Repository → Database
                                  ↓
Response ← Controller ← Service ← Repository ← Database
```

### Ví dụ: Tạo nhóm nghiên cứu

1. **Route** (`nhomNghienCuu.js`): Nhận POST request tại `/api/research-groups`
2. **Controller** (`nhomNghienCuuController.js`): Gọi `nhomNghienCuuService.taoNhomNghienCuu()`
3. **Service** (`nhomNghienCuuService.js`): 
   - Kiểm tra sinh viên tồn tại
   - Kiểm tra đề tài tồn tại
   - Kiểm tra sinh viên đã có nhóm chưa
   - Tạo mã nhóm tự động
   - Gọi repository để tạo nhóm
4. **Repository** (`nhomNghienCuuRepository.js`): Thực hiện query Prisma để insert vào database
5. **Response**: Trả về thông tin nhóm vừa tạo

---

## Quy tắc code

### 1. Naming Convention
- **Controllers**: `<tên>Controller.js` - PascalCase cho class
- **Services**: `<tên>Service.js` - PascalCase cho class
- **Repositories**: `<tên>Repository.js` - PascalCase cho class
- **Routes**: `<tên>.js` - camelCase
- **Functions**: camelCase (vd: `getDanhSachDeTai`)
- **Constants**: UPPER_SNAKE_CASE

### 2. Error Handling
- Sử dụng `try-catch` trong controllers
- Throw error với message rõ ràng trong services
- Middleware `errorHandler` xử lý lỗi tập trung

### 3. Response Format
```javascript
// Success
{
  success: true,
  message: "Thành công",
  data: { ... }
}

// Error
{
  success: false,
  message: "Lỗi",
  errors: [ ... ]
}

// Paginated
{
  success: true,
  data: [ ... ],
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10
  }
}
```

### 4. Validation
- Validate ở tầng Service trước khi gọi Repository
- Sử dụng middleware `validateRequest` cho validation phức tạp
- Trả về lỗi rõ ràng với field và message

---

## Cách chạy dự án

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình database
Tạo file `.env`:
```
DATABASE_URL="postgresql://user:password@host:port/database"
PORT=3000
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Chạy migration
```bash
npm run prisma:migrate
```

### 5. Chạy server
```bash
# Development
npm run dev

# Production
npm start
```

---

## Testing API

### Sử dụng curl hoặc Postman

**Ví dụ: Lấy danh sách đề tài**
```bash
curl http://localhost:3000/api/topics?page=1&limit=10
```

**Ví dụ: Tạo nhóm nghiên cứu**
```bash
curl -X POST http://localhost:3000/api/research-groups \
  -H "Content-Type: application/json" \
  -d '{
    "tenNhom": "Nhóm AI",
    "truongNhomId": 1,
    "deTaiId": 1
  }'
```

---

## Mở rộng trong tương lai

- Thêm authentication/authorization (JWT)
- Thêm rate limiting
- Thêm logging
- Thêm caching (Redis)
- Thêm file upload
- Thêm email notification
- Thêm unit tests
- Thêm API documentation (Swagger)

---

## Liên hệ và hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ với người phụ trách tương ứng theo phân công ở trên.
