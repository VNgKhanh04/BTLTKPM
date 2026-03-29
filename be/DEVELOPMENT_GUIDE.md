# Hướng dẫn phát triển Backend

## Dành cho 5 thành viên

Tài liệu này hướng dẫn chi tiết cách mỗi thành viên phát triển phần của mình.

---

## Quy trình làm việc chung

### 1. Setup môi trường
```bash
# Clone repository
git clone <repo-url>
cd be

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env
# Sau đó cập nhật DATABASE_URL trong .env

# Generate Prisma Client
npm run prisma:generate

# Chạy migration
npm run prisma:migrate
```

### 2. Chạy server development
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

### 3. Test API
Sử dụng Postman hoặc curl để test API của bạn.

---

## Hướng dẫn cho từng thành viên

### Thành viên 1: Danh sách đề tài và tìm kiếm

#### Files cần làm việc:
- `src/controllers/deTaiController.js`
- `src/services/deTaiService.js`
- `src/repositories/deTaiRepository.js`
- `src/routes/deTai.js`
- `src/controllers/linhVucController.js`
- `src/services/linhVucService.js`
- `src/repositories/linhVucRepository.js`
- `src/routes/linhVuc.js`

#### Nhiệm vụ:
1. **Hoàn thiện Repository Layer**
   - Đã có sẵn các hàm cơ bản
   - Có thể thêm các query phức tạp hơn nếu cần

2. **Hoàn thiện Service Layer**
   - Logic đã được implement
   - Có thể thêm validation hoặc business rules

3. **Test API**
   ```bash
   # Lấy danh sách đề tài
   curl http://localhost:3000/api/topics
   
   # Tìm kiếm đề tài
   curl "http://localhost:3000/api/topics?keyword=AI&fieldId=1"
   
   # Lấy chi tiết đề tài
   curl http://localhost:3000/api/topics/1
   
   # Lấy danh sách lĩnh vực
   curl http://localhost:3000/api/fields
   ```

4. **Tích hợp với Frontend**
   - Đảm bảo response format đúng
   - Xử lý pagination đúng
   - Xử lý các trường hợp lỗi

---

### Thành viên 2: Tạo nhóm đăng ký đề tài

#### Files cần làm việc:
- `src/controllers/nhomNghienCuuController.js`
- `src/services/nhomNghienCuuService.js`
- `src/repositories/nhomNghienCuuRepository.js`
- `src/routes/nhomNghienCuu.js`
- `src/controllers/sinhVienController.js`
- `src/services/sinhVienService.js`
- `src/repositories/sinhVienRepository.js`

#### Nhiệm vụ:
1. **Test luồng tạo nhóm**
   ```bash
   # Tạo nhóm
   curl -X POST http://localhost:3000/api/research-groups \
     -H "Content-Type: application/json" \
     -d '{
       "tenNhom": "Nhóm AI Research",
       "truongNhomId": 1,
       "deTaiId": 1
     }'
   
   # Thêm thành viên
   curl -X POST http://localhost:3000/api/research-groups/1/members \
     -H "Content-Type: application/json" \
     -d '{
       "sinhVienId": 2,
       "vaiTro": "THANH_VIEN"
     }'
   
   # Tìm sinh viên
   curl "http://localhost:3000/api/students/search?keyword=Nguyen"
   ```

2. **Xử lý validation**
   - Kiểm tra số lượng thành viên tối đa
   - Kiểm tra sinh viên đã có nhóm chưa
   - Kiểm tra không xóa trưởng nhóm

3. **Tích hợp với Frontend**
   - Form tạo nhóm
   - Form thêm/xóa thành viên
   - Hiển thị danh sách thành viên

---

### Thành viên 3: Chọn giảng viên hướng dẫn

#### Files cần làm việc:
- `src/controllers/giangVienController.js`
- `src/services/giangVienService.js`
- `src/repositories/giangVienRepository.js`
- `src/routes/giangVien.js`

#### Nhiệm vụ:
1. **Test API giảng viên**
   ```bash
   # Lấy danh sách giảng viên
   curl http://localhost:3000/api/lecturers
   
   # Tìm theo chuyên môn
   curl "http://localhost:3000/api/lecturers?specialization=AI"
   
   # Kiểm tra quota
   curl http://localhost:3000/api/lecturers/1/quota
   
   # Gán giảng viên hướng dẫn
   curl -X PUT http://localhost:3000/api/lecturers/research-groups/1/advisor \
     -H "Content-Type: application/json" \
     -d '{"giangVienId": 1}'
   ```

2. **Xử lý logic quota**
   - Đếm số lượng đang hướng dẫn
   - Kiểm tra còn chỗ không
   - Cảnh báo khi đã đủ quota

3. **Tích hợp với Frontend**
   - Danh sách giảng viên với thông tin quota
   - Hiển thị chuyên môn
   - Disable nút chọn khi đã đủ quota

---

### Thành viên 4: Nộp hồ sơ đăng ký đề tài

#### Files cần làm việc:
- `src/controllers/hoSoDangKyController.js`
- `src/services/hoSoDangKyService.js`
- `src/repositories/hoSoDangKyRepository.js`
- `src/routes/hoSoDangKy.js`

#### Nhiệm vụ:
1. **Test luồng nộp hồ sơ**
   ```bash
   # Tạo hồ sơ
   curl -X POST http://localhost:3000/api/topic-registrations \
     -H "Content-Type: application/json" \
     -d '{
       "nhomId": 1,
       "deTaiId": 1,
       "lyDoChonDeTai": "Quan tâm đến AI",
       "nguoiTaoId": 1
     }'
   
   # Xem chi tiết hồ sơ
   curl http://localhost:3000/api/topic-registrations/1
   
   # Xác nhận nộp
   curl -X PATCH http://localhost:3000/api/topic-registrations/1/submit
   
   # Xem timeline
   curl http://localhost:3000/api/topic-registrations/1/timeline
   ```

2. **Xử lý trạng thái hồ sơ**
   - CHO_PHE_DUYET → DA_NOP → DA_DUYET
   - Không cho cập nhật khi đã duyệt
   - Lưu lịch sử thay đổi

3. **Tích hợp với Frontend**
   - Form review hồ sơ
   - Timeline trạng thái
   - Nút xác nhận nộp

---

### Thành viên 5: Validation và thông báo

#### Files cần làm việc:
- `src/controllers/validationController.js`
- `src/services/validationService.js`
- `src/controllers/thongBaoController.js`
- `src/services/thongBaoService.js`
- `src/repositories/thongBaoRepository.js`
- `src/middlewares/errorHandler.js`
- `src/middlewares/validateRequest.js`

#### Nhiệm vụ:
1. **Test validation**
   ```bash
   # Validate hồ sơ
   curl -X POST http://localhost:3000/api/topic-registrations/validate \
     -H "Content-Type: application/json" \
     -d '{
       "nhomId": 1,
       "deTaiId": 1
     }'
   
   # Kiểm tra trùng đề tài
   curl -X POST http://localhost:3000/api/validation/topics/1/check-duplicate \
     -H "Content-Type: application/json" \
     -d '{"nhomId": 1}'
   ```

2. **Test thông báo**
   ```bash
   # Tạo thông báo
   curl -X POST http://localhost:3000/api/notifications \
     -H "Content-Type: application/json" \
     -d '{
       "tieu_de": "Test",
       "noi_dung": "Nội dung test",
       "nguoi_nhan_id": 1,
       "loai_nguoi_nhan": "SINH_VIEN",
       "loai_thong_bao": "THONG_BAO_CHUNG"
     }'
   
   # Lấy danh sách thông báo
   curl "http://localhost:3000/api/notifications?nguoiNhanId=1&loaiNguoiNhan=SINH_VIEN"
   
   # Đánh dấu đã đọc
   curl -X PATCH http://localhost:3000/api/notifications/1/read
   ```

3. **Hoàn thiện error handler**
   - Xử lý các loại lỗi Prisma
   - Format error message rõ ràng
   - Log lỗi để debug

4. **Tích hợp với Frontend**
   - Toast notification
   - Popup lỗi
   - Badge số thông báo chưa đọc

---

## Quy tắc code chung

### 1. Async/Await
Luôn sử dụng async/await và try-catch:
```javascript
async getDanhSach(req, res) {
  try {
    const result = await service.getDanhSach();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 2. Response Format
Sử dụng format chuẩn:
```javascript
// Success
res.json({
  success: true,
  data: result
});

// Error
res.status(400).json({
  success: false,
  error: 'Message lỗi'
});
```

### 3. Validation
Validate ở Service layer:
```javascript
async taoNhom(nhomData) {
  if (!nhomData.tenNhom) {
    throw new Error('Tên nhóm không được để trống');
  }
  // ... logic khác
}
```

### 4. Repository Pattern
Repository chỉ chứa query database:
```javascript
async findById(id) {
  return await prisma.model.findUnique({
    where: { id },
    include: { ... }
  });
}
```

---

## Debug và troubleshooting

### 1. Kiểm tra kết nối database
```bash
curl http://localhost:3000/health
```

### 2. Xem log Prisma
Thêm vào `.env`:
```
DEBUG=prisma:query
```

### 3. Test từng layer
- Test Repository trước
- Sau đó test Service
- Cuối cùng test Controller

### 4. Sử dụng Prisma Studio
```bash
npm run prisma:studio
```
Mở browser tại `http://localhost:5555` để xem dữ liệu.

---

## Checklist trước khi commit

- [ ] Code chạy không lỗi
- [ ] Đã test API bằng Postman/curl
- [ ] Đã xử lý error cases
- [ ] Response format đúng chuẩn
- [ ] Đã validate input
- [ ] Đã comment code phức tạp
- [ ] Đã update documentation nếu cần

---

## Git workflow

```bash
# Tạo branch mới cho feature
git checkout -b feature/ten-feature

# Commit thường xuyên
git add .
git commit -m "feat: mô tả ngắn gọn"

# Push lên remote
git push origin feature/ten-feature

# Tạo Pull Request để review
```

---

## Liên hệ

Nếu gặp vấn đề, hỏi trong nhóm hoặc tham khảo:
- Prisma Docs: https://www.prisma.io/docs
- Express Docs: https://expressjs.com
- PostgreSQL Docs: https://www.postgresql.org/docs
