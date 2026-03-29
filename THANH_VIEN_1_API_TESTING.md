# Hướng dẫn Test API - Thành viên 1

## Chuẩn bị

### 1. Khởi động Backend
```bash
cd be
npm start
```
Server chạy tại: http://localhost:3000

### 2. Seed dữ liệu mẫu
```bash
cd be
node prisma/seed-thanh-vien-1.js
```

### 3. Công cụ test
- Postman (khuyến nghị)
- Thunder Client (VS Code extension)
- curl (command line)
- Browser (cho GET requests)

## Test Cases

### 1. Health Check
Kiểm tra server đang chạy

**Request:**
```
GET http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-03-29T..."
}
```

---

### 2. Lấy danh sách đề tài (không filter)

**Request:**
```
GET http://localhost:3000/api/topics
```

**Expected Response:**
```json
{
  "data": [
    {
      "de_tai_id": 1,
      "ma_de_tai": "DT001",
      "ten_de_tai": "Xây dựng hệ thống nhận diện khuôn mặt...",
      "linh_vuc_id": 1,
      "mo_ta": "...",
      "trang_thai": "MO_DANG_KY",
      "LinhVucNghienCuu": {
        "linh_vuc_id": 1,
        "ten_linh_vuc": "Trí tuệ nhân tạo"
      },
      "GiangVien": {
        "giang_vien_id": 1,
        "ho_ten": "TS. Nguyễn Văn A"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

---

### 3. Lấy danh sách đề tài với phân trang

**Request:**
```
GET http://localhost:3000/api/topics?page=1&limit=5
```

**Expected Response:**
- Trả về 5 đề tài đầu tiên
- pagination.limit = 5
- pagination.totalPages được tính dựa trên total

---

### 4. Tìm kiếm đề tài theo từ khóa

**Request:**
```
GET http://localhost:3000/api/topics?keyword=chatbot
```

**Expected Response:**
- Chỉ trả về các đề tài có chứa "chatbot" trong tên hoặc mã đề tài
- Tìm kiếm không phân biệt hoa thường

**Test cases:**
- keyword=AI → Tìm đề tài liên quan AI
- keyword=web → Tìm đề tài web
- keyword=DT001 → Tìm theo mã đề tài

---

### 5. Lọc đề tài theo lĩnh vực

**Request:**
```
GET http://localhost:3000/api/topics?fieldId=1
```

**Expected Response:**
- Chỉ trả về các đề tài thuộc lĩnh vực có ID = 1 (Trí tuệ nhân tạo)

**Test với các lĩnh vực khác:**
- fieldId=2 → Phát triển Web
- fieldId=3 → An toàn thông tin
- fieldId=4 → Phát triển Mobile
- fieldId=5 → Khoa học dữ liệu

---

### 6. Lọc đề tài theo trạng thái

**Request:**
```
GET http://localhost:3000/api/topics?status=MO_DANG_KY
```

**Expected Response:**
- Chỉ trả về các đề tài đang mở đăng ký

**Test với các trạng thái khác:**
- status=DANG_THUC_HIEN
- status=HOAN_THANH
- status=DONG

---

### 7. Kết hợp nhiều filter

**Request:**
```
GET http://localhost:3000/api/topics?keyword=hệ thống&fieldId=1&status=MO_DANG_KY&page=1&limit=5
```

**Expected Response:**
- Đề tài có chứa "hệ thống"
- Thuộc lĩnh vực AI (ID=1)
- Trạng thái MO_DANG_KY
- Phân trang: trang 1, 5 items

---

### 8. Lấy chi tiết đề tài

**Request:**
```
GET http://localhost:3000/api/topics/1
```

**Expected Response:**
```json
{
  "de_tai_id": 1,
  "ma_de_tai": "DT001",
  "ten_de_tai": "Xây dựng hệ thống nhận diện khuôn mặt...",
  "linh_vuc_id": 1,
  "mo_ta": "...",
  "muc_tieu": "...",
  "yeu_cau": "...",
  "so_luong_thanh_vien_toi_da": 3,
  "giang_vien_huong_dan_id": 1,
  "trang_thai": "MO_DANG_KY",
  "nam_hoc": "2023-2024",
  "hoc_ky": "HK2",
  "LinhVucNghienCuu": {
    "linh_vuc_id": 1,
    "ma_linh_vuc": "LV001",
    "ten_linh_vuc": "Trí tuệ nhân tạo",
    "mo_ta": "..."
  },
  "GiangVien": {
    "giang_vien_id": 1,
    "ma_giang_vien": "GV001",
    "ho_ten": "TS. Nguyễn Văn A",
    "email": "nguyenvana@university.edu.vn",
    "chuyen_mon": "Trí tuệ nhân tạo, Machine Learning"
  },
  "NhomNghienCuu": []
}
```

**Test error case:**
```
GET http://localhost:3000/api/topics/999
```
Expected: 404 Not Found

---

### 9. Kiểm tra khả năng đăng ký đề tài

**Request:**
```
GET http://localhost:3000/api/topics/1/availability
```

**Expected Response (available):**
```json
{
  "available": true,
  "reason": null
}
```

**Expected Response (not available):**
```json
{
  "available": false,
  "reason": "Đề tài không trong trạng thái mở đăng ký"
}
```

hoặc

```json
{
  "available": false,
  "reason": "Đề tài đã có nhóm đăng ký"
}
```

**Test cases:**
- Đề tài có status = MO_DANG_KY và chưa có nhóm → available = true
- Đề tài có status khác MO_DANG_KY → available = false
- Đề tài đã có nhóm đăng ký → available = false

---

### 10. Lấy danh sách lĩnh vực

**Request:**
```
GET http://localhost:3000/api/fields
```

**Expected Response:**
```json
[
  {
    "linh_vuc_id": 1,
    "ma_linh_vuc": "LV001",
    "ten_linh_vuc": "Trí tuệ nhân tạo",
    "mo_ta": "Nghiên cứu về AI, Machine Learning, Deep Learning",
    "trang_thai": 1,
    "ngay_tao": "...",
    "ngay_cap_nhat": "..."
  },
  {
    "linh_vuc_id": 2,
    "ma_linh_vuc": "LV002",
    "ten_linh_vuc": "Phát triển Web",
    "mo_ta": "...",
    "trang_thai": 1,
    "ngay_tao": "...",
    "ngay_cap_nhat": "..."
  }
]
```

---

### 11. Lấy chi tiết lĩnh vực

**Request:**
```
GET http://localhost:3000/api/fields/1
```

**Expected Response:**
```json
{
  "linh_vuc_id": 1,
  "ma_linh_vuc": "LV001",
  "ten_linh_vuc": "Trí tuệ nhân tạo",
  "mo_ta": "Nghiên cứu về AI, Machine Learning, Deep Learning",
  "trang_thai": 1,
  "ngay_tao": "...",
  "ngay_cap_nhat": "..."
}
```

**Test error case:**
```
GET http://localhost:3000/api/fields/999
```
Expected: 404 Not Found

---

## Test với curl

### Lấy danh sách đề tài
```bash
curl http://localhost:3000/api/topics
```

### Tìm kiếm đề tài
```bash
curl "http://localhost:3000/api/topics?keyword=AI&fieldId=1"
```

### Lấy chi tiết đề tài
```bash
curl http://localhost:3000/api/topics/1
```

### Kiểm tra availability
```bash
curl http://localhost:3000/api/topics/1/availability
```

### Lấy danh sách lĩnh vực
```bash
curl http://localhost:3000/api/fields
```

---

## Postman Collection

Tạo collection trong Postman với các request sau:

### Folder: Topics
1. Get All Topics
2. Get Topics with Pagination
3. Search Topics by Keyword
4. Filter Topics by Field
5. Filter Topics by Status
6. Combined Filters
7. Get Topic Detail
8. Check Topic Availability

### Folder: Fields
1. Get All Fields
2. Get Field Detail

### Environment Variables
```
base_url: http://localhost:3000
api_url: {{base_url}}/api
```

---

## Checklist Testing

### Functional Tests
- [ ] Lấy danh sách đề tài thành công
- [ ] Phân trang hoạt động đúng
- [ ] Tìm kiếm theo keyword chính xác
- [ ] Lọc theo lĩnh vực chính xác
- [ ] Lọc theo trạng thái chính xác
- [ ] Kết hợp nhiều filter hoạt động
- [ ] Lấy chi tiết đề tài thành công
- [ ] Kiểm tra availability chính xác
- [ ] Lấy danh sách lĩnh vực thành công
- [ ] Lấy chi tiết lĩnh vực thành công

### Error Handling Tests
- [ ] 404 khi ID không tồn tại
- [ ] 500 khi có lỗi server
- [ ] Xử lý query params không hợp lệ
- [ ] Xử lý khi database disconnect

### Performance Tests
- [ ] Response time < 500ms cho list
- [ ] Response time < 200ms cho detail
- [ ] Pagination với large dataset
- [ ] Search với nhiều kết quả

### Edge Cases
- [ ] page = 0 hoặc âm
- [ ] limit quá lớn (>100)
- [ ] keyword rỗng
- [ ] fieldId không tồn tại
- [ ] Đề tài không có giảng viên
- [ ] Đề tài không có lĩnh vực

---

## Báo cáo lỗi

Nếu phát hiện lỗi, ghi nhận:
1. Request URL đầy đủ
2. Method (GET/POST/...)
3. Response status code
4. Response body
5. Expected behavior
6. Actual behavior
7. Steps to reproduce

---

## Tích hợp với Frontend

Sau khi test API thành công, kiểm tra:
1. Frontend gọi đúng endpoint
2. Frontend xử lý response đúng
3. Frontend hiển thị lỗi phù hợp
4. Frontend xử lý loading state
5. Frontend xử lý pagination
6. Frontend xử lý search/filter

---

## Lưu ý

1. Đảm bảo database đã có dữ liệu seed
2. Kiểm tra CORS nếu test từ browser
3. Kiểm tra port 3000 không bị chiếm
4. Restart server sau khi thay đổi code
5. Clear cache nếu response không đúng
