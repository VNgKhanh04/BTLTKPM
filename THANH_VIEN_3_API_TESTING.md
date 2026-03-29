# Hướng dẫn Test API - Thành viên 3: Chọn giảng viên hướng dẫn

## 📋 Tổng quan

Document này hướng dẫn chi tiết cách test các API của Thành viên 3 sử dụng:
- cURL (Command line)
- Postman
- Thunder Client (VS Code extension)

---

## 🚀 Chuẩn bị

### 1. Khởi động Backend

```bash
cd be
npm start
```

Server chạy tại: `http://localhost:3000`

### 2. Chạy Seed Data

```bash
cd be
node prisma/seed-thanh-vien-3.js
```

Kết quả:
- 12 giảng viên được tạo
- Một số đề tài đã được gán giảng viên

---

## 📡 API Endpoints

### 1. GET /api/lecturers - Lấy danh sách giảng viên

#### Test với cURL

```bash
# Lấy tất cả giảng viên
curl http://localhost:3000/api/lecturers

# Tìm theo keyword
curl "http://localhost:3000/api/lecturers?keyword=Nguyễn"

# Lọc theo chuyên môn
curl "http://localhost:3000/api/lecturers?specialization=Machine%20Learning"

# Kết hợp cả hai
curl "http://localhost:3000/api/lecturers?keyword=TS&specialization=AI"
```

#### Test với Postman

1. Tạo request mới: `GET http://localhost:3000/api/lecturers`
2. Thêm Query Params:
   - `keyword`: Nguyễn
   - `specialization`: Machine Learning
3. Click Send

#### Expected Response

```json
[
  {
    "giang_vien_id": 1,
    "ma_giang_vien": "GV001",
    "ho_ten": "TS. Nguyễn Văn An",
    "email": "nva@university.edu.vn",
    "so_dien_thoai": "0901234567",
    "khoa_id": 1,
    "chuyen_mon": "Trí tuệ nhân tạo, Machine Learning, Deep Learning",
    "so_luong_huong_dan_toi_da": 5,
    "trang_thai": 1,
    "ngay_tao": "2024-03-29T...",
    "ngay_cap_nhat": "2024-03-29T...",
    "Khoa": {
      "khoa_id": 1,
      "ma_khoa": "CNTT",
      "ten_khoa": "Công nghệ thông tin",
      "email_lien_he": "cntt@university.edu.vn",
      "so_dien_thoai": "0241234567",
      "trang_thai": 1
    }
  }
]
```

#### Test Cases

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| TC1: Lấy tất cả | No params | Array of all lecturers |
| TC2: Tìm theo tên | keyword=Nguyễn | Lecturers có tên chứa "Nguyễn" |
| TC3: Tìm theo email | keyword=@university | All lecturers (all have @university) |
| TC4: Lọc chuyên môn | specialization=AI | Lecturers có chuyên môn AI |
| TC5: Không tìm thấy | keyword=XYZ123 | Empty array [] |

---

### 2. GET /api/lecturers/:id - Lấy chi tiết giảng viên

#### Test với cURL

```bash
# Lấy chi tiết giảng viên ID 1
curl http://localhost:3000/api/lecturers/1

# Giảng viên không tồn tại
curl http://localhost:3000/api/lecturers/999
```

#### Test với Postman

1. Tạo request: `GET http://localhost:3000/api/lecturers/1`
2. Click Send

#### Expected Response (Success)

```json
{
  "giang_vien_id": 1,
  "ma_giang_vien": "GV001",
  "ho_ten": "TS. Nguyễn Văn An",
  "email": "nva@university.edu.vn",
  "so_dien_thoai": "0901234567",
  "khoa_id": 1,
  "chuyen_mon": "Trí tuệ nhân tạo, Machine Learning, Deep Learning",
  "so_luong_huong_dan_toi_da": 5,
  "trang_thai": 1,
  "so_luong_dang_huong_dan": 0,
  "Khoa": { ... },
  "DeTaiNghienCuu": [],
  "NhomNghienCuu": []
}
```

#### Expected Response (Not Found)

```json
{
  "error": "Không tìm thấy giảng viên"
}
```

Status Code: 404

#### Test Cases

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| TC1: ID hợp lệ | id=1 | Lecturer details with relations |
| TC2: ID không tồn tại | id=999 | 404 error |
| TC3: ID không hợp lệ | id=abc | 500 error |

---

### 3. GET /api/lecturers/:id/quota - Kiểm tra quota hướng dẫn

#### Test với cURL

```bash
# Kiểm tra quota giảng viên ID 1
curl http://localhost:3000/api/lecturers/1/quota

# Giảng viên không tồn tại
curl http://localhost:3000/api/lecturers/999/quota
```

#### Test với Postman

1. Tạo request: `GET http://localhost:3000/api/lecturers/1/quota`
2. Click Send

#### Expected Response (Success)

```json
{
  "giang_vien_id": 1,
  "ho_ten": "TS. Nguyễn Văn An",
  "so_luong_toi_da": 5,
  "so_luong_dang_huong_dan": 0,
  "con_cho": 5,
  "co_the_nhan_them": true
}
```

#### Expected Response (Not Found)

```json
{
  "error": "Không tìm thấy giảng viên"
}
```

Status Code: 500

#### Test Cases

| Test Case | Scenario | Expected Output |
|-----------|----------|-----------------|
| TC1: Chưa hướng dẫn | Lecturer with 0 groups | con_cho = so_luong_toi_da |
| TC2: Đang hướng dẫn | Lecturer with some groups | con_cho = toi_da - dang_huong_dan |
| TC3: Đã đủ quota | Lecturer at max capacity | con_cho = 0, co_the_nhan_them = false |
| TC4: ID không tồn tại | id=999 | Error message |

---

### 4. PUT /api/research-groups/:id/advisor - Gán giảng viên hướng dẫn

#### Test với cURL

```bash
# Gán giảng viên ID 1 cho nhóm ID 1
curl -X PUT http://localhost:3000/api/research-groups/1/advisor \
  -H "Content-Type: application/json" \
  -d '{"giangVienId": 1}'

# Gán giảng viên đã đủ quota
curl -X PUT http://localhost:3000/api/research-groups/1/advisor \
  -H "Content-Type: application/json" \
  -d '{"giangVienId": 999}'
```

#### Test với Postman

1. Tạo request: `PUT http://localhost:3000/api/research-groups/1/advisor`
2. Chọn Body → raw → JSON
3. Nhập:
```json
{
  "giangVienId": 1
}
```
4. Click Send

#### Expected Response (Success)

```json
{
  "nhom_id": 1,
  "ma_nhom": "NHOM2024001",
  "ten_nhom": "Nhóm AI Research",
  "truong_nhom_id": 1,
  "de_tai_id": 1,
  "giang_vien_huong_dan_id": 1,
  "so_luong_thanh_vien": 3,
  "trang_thai": "CHO_DUYET",
  "ngay_tao": "2024-03-29T...",
  "ngay_cap_nhat": "2024-03-29T..."
}
```

#### Expected Response (Errors)

**Nhóm không tồn tại:**
```json
{
  "error": "Không tìm thấy nhóm"
}
```

**Giảng viên không tồn tại:**
```json
{
  "error": "Không tìm thấy giảng viên"
}
```

**Giảng viên đã đủ quota:**
```json
{
  "error": "Giảng viên đã đủ số lượng hướng dẫn"
}
```

Status Code: 400

#### Test Cases

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| TC1: Gán thành công | Valid groupId & lecturerId | Updated group with advisor |
| TC2: Nhóm không tồn tại | groupId=999 | Error: Không tìm thấy nhóm |
| TC3: GV không tồn tại | lecturerId=999 | Error: Không tìm thấy giảng viên |
| TC4: GV đã đủ quota | lecturerId with full quota | Error: Đã đủ số lượng |
| TC5: Missing giangVienId | No body | Error |
| TC6: Gán lại GV khác | Change advisor | Updated successfully |

---

## 🧪 Test Scenarios (End-to-End)

### Scenario 1: Chọn giảng viên thành công

**Bước 1:** Lấy danh sách giảng viên
```bash
curl http://localhost:3000/api/lecturers
```

**Bước 2:** Kiểm tra quota giảng viên ID 1
```bash
curl http://localhost:3000/api/lecturers/1/quota
```

**Bước 3:** Gán giảng viên cho nhóm
```bash
curl -X PUT http://localhost:3000/api/research-groups/1/advisor \
  -H "Content-Type: application/json" \
  -d '{"giangVienId": 1}'
```

**Bước 4:** Kiểm tra lại quota (đã tăng lên 1)
```bash
curl http://localhost:3000/api/lecturers/1/quota
```

**Expected:** `so_luong_dang_huong_dan` tăng từ 0 lên 1

---

### Scenario 2: Không thể chọn giảng viên đã đủ quota

**Bước 1:** Tạo nhiều nhóm và gán cùng 1 giảng viên cho đến khi đủ quota

**Bước 2:** Kiểm tra quota
```bash
curl http://localhost:3000/api/lecturers/1/quota
```

**Expected:** `co_the_nhan_them: false`

**Bước 3:** Thử gán thêm nhóm mới
```bash
curl -X PUT http://localhost:3000/api/research-groups/6/advisor \
  -H "Content-Type: application/json" \
  -d '{"giangVienId": 1}'
```

**Expected:** Error "Giảng viên đã đủ số lượng hướng dẫn"

---

### Scenario 3: Tìm kiếm giảng viên theo chuyên môn

**Bước 1:** Tìm giảng viên chuyên về AI
```bash
curl "http://localhost:3000/api/lecturers?specialization=AI"
```

**Expected:** Danh sách giảng viên có chuyên môn chứa "AI"

**Bước 2:** Kiểm tra quota từng giảng viên
```bash
curl http://localhost:3000/api/lecturers/1/quota
curl http://localhost:3000/api/lecturers/8/quota
```

**Bước 3:** Chọn giảng viên còn chỗ
```bash
curl -X PUT http://localhost:3000/api/research-groups/1/advisor \
  -H "Content-Type: application/json" \
  -d '{"giangVienId": 1}'
```

---

## 🔍 Validation Testing

### 1. Input Validation

| Field | Valid | Invalid | Expected |
|-------|-------|---------|----------|
| keyword | "Nguyễn" | "" (empty) | Return all |
| specialization | "AI" | "" (empty) | Return all |
| lecturerId | 1 | "abc" | Error |
| lecturerId | 1 | -1 | Not found |
| groupId | 1 | 999 | Not found |

### 2. Business Logic Validation

| Rule | Test | Expected |
|------|------|----------|
| Quota check | Assign when full | Error |
| Lecturer exists | Assign non-existent | Error |
| Group exists | Assign to non-existent group | Error |
| Count accuracy | Check after multiple assigns | Correct count |

---

## 📊 Performance Testing

### Load Test với cURL

```bash
# Test 100 requests liên tiếp
for i in {1..100}; do
  curl -s http://localhost:3000/api/lecturers > /dev/null
  echo "Request $i completed"
done
```

### Expected Performance

- Response time < 200ms cho GET requests
- Response time < 500ms cho PUT requests
- No errors under normal load
- Database connection stable

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to server"

**Solution:**
```bash
# Kiểm tra server đang chạy
cd be
npm start
```

### Issue 2: "Không tìm thấy giảng viên"

**Solution:**
```bash
# Chạy seed data
cd be
node prisma/seed-thanh-vien-3.js
```

### Issue 3: "CORS error" từ Frontend

**Solution:**
- Kiểm tra CORS config trong `be/src/index.js`
- Đảm bảo `app.use(cors())` được gọi

### Issue 4: Quota không cập nhật

**Solution:**
- Kiểm tra trạng thái nhóm (chỉ đếm CHO_DUYET, DANG_THUC_HIEN)
- Kiểm tra logic trong `countCurrentlySupervising()`

---

## ✅ Test Checklist

### API Functionality
- [ ] GET /api/lecturers - Lấy tất cả
- [ ] GET /api/lecturers?keyword - Tìm kiếm
- [ ] GET /api/lecturers?specialization - Lọc chuyên môn
- [ ] GET /api/lecturers/:id - Chi tiết
- [ ] GET /api/lecturers/:id/quota - Kiểm tra quota
- [ ] PUT /api/research-groups/:id/advisor - Gán GV

### Error Handling
- [ ] 404 - Lecturer not found
- [ ] 404 - Group not found
- [ ] 400 - Lecturer at full capacity
- [ ] 400 - Missing required fields
- [ ] 500 - Server errors

### Business Logic
- [ ] Quota tính đúng
- [ ] Không gán khi đã đủ quota
- [ ] Search case-insensitive
- [ ] Filter hoạt động đúng
- [ ] Relations được load đầy đủ

### Integration
- [ ] Tích hợp với Thành viên 2 (nhóm)
- [ ] Navigation từ CreateGroup
- [ ] Data flow đúng
- [ ] State management đúng

---

## 📝 Test Report Template

```markdown
# Test Report - Thành viên 3

**Ngày test:** [Date]
**Người test:** [Name]

## Summary
- Total tests: X
- Passed: Y
- Failed: Z

## Test Results

### API Tests
| Endpoint | Status | Notes |
|----------|--------|-------|
| GET /api/lecturers | ✅ | |
| GET /api/lecturers/:id | ✅ | |
| GET /api/lecturers/:id/quota | ✅ | |
| PUT /api/research-groups/:id/advisor | ✅ | |

### Issues Found
1. [Issue description]
   - Severity: High/Medium/Low
   - Steps to reproduce
   - Expected vs Actual

## Recommendations
- [Recommendation 1]
- [Recommendation 2]
```

---

**Hoàn thành:** 29/03/2024
**Người tạo:** Kiro AI Assistant
