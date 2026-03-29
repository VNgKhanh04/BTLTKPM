# Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

## Tổng quan
Thành viên 1 phụ trách phát triển chức năng danh sách đề tài, tìm kiếm và lọc đề tài nghiên cứu. Đây là điểm khởi đầu của luồng đăng ký đề tài.

## Phạm vi công việc

### Backend (NodeJS + Prisma + PostgreSQL)

#### 1. Controllers
- `be/src/controllers/deTaiController.js` - Xử lý HTTP requests cho đề tài
- `be/src/controllers/linhVucController.js` - Xử lý HTTP requests cho lĩnh vực

#### 2. Services
- `be/src/services/deTaiService.js` - Logic nghiệp vụ đề tài
- `be/src/services/linhVucService.js` - Logic nghiệp vụ lĩnh vực

#### 3. Repositories
- `be/src/repositories/deTaiRepository.js` - Truy vấn database đề tài
- `be/src/repositories/linhVucRepository.js` - Truy vấn database lĩnh vực

#### 4. Routes
- `be/src/routes/deTai.js` - Định nghĩa API endpoints cho đề tài
- `be/src/routes/linhVuc.js` - Định nghĩa API endpoints cho lĩnh vực

### Frontend (React)

#### 1. Components
- `fe/src/components/TopicList.js` - Component danh sách đề tài
- `fe/src/components/TopicCard.js` - Component card hiển thị đề tài
- `fe/src/components/TopicDetail.js` - Component chi tiết đề tài
- `fe/src/components/SearchBar.js` - Component thanh tìm kiếm
- `fe/src/components/FilterPanel.js` - Component bộ lọc
- `fe/src/components/Pagination.js` - Component phân trang

#### 2. Services
- `fe/src/services/api.js` - Cấu hình và gọi API

#### 3. Styles
- `fe/src/styles/TopicList.css`
- `fe/src/styles/TopicCard.css`
- `fe/src/styles/TopicDetail.css`
- `fe/src/styles/SearchBar.css`
- `fe/src/styles/FilterPanel.css`
- `fe/src/styles/Pagination.css`

## API Endpoints

### 1. Lấy danh sách đề tài
```
GET /api/topics
Query Parameters:
  - page: số trang (mặc định: 1)
  - limit: số lượng mỗi trang (mặc định: 10)
  - keyword: từ khóa tìm kiếm
  - fieldId: ID lĩnh vực
  - status: trạng thái đề tài
  - namHoc: năm học
  - hocKy: học kỳ

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. Lấy chi tiết đề tài
```
GET /api/topics/:id

Response:
{
  "de_tai_id": 1,
  "ma_de_tai": "DT001",
  "ten_de_tai": "...",
  "LinhVucNghienCuu": {...},
  "GiangVien": {...},
  ...
}
```

### 3. Kiểm tra khả năng đăng ký
```
GET /api/topics/:id/availability

Response:
{
  "available": true/false,
  "reason": "..."
}
```

### 4. Lấy danh sách lĩnh vực
```
GET /api/fields

Response:
[
  {
    "linh_vuc_id": 1,
    "ma_linh_vuc": "LV001",
    "ten_linh_vuc": "...",
    ...
  }
]
```

### 5. Lấy chi tiết lĩnh vực
```
GET /api/fields/:id

Response:
{
  "linh_vuc_id": 1,
  "ma_linh_vuc": "LV001",
  "ten_linh_vuc": "...",
  ...
}
```

## Cài đặt và chạy

### Backend

1. Di chuyển vào thư mục backend:
```bash
cd be
```

2. Cài đặt dependencies (nếu chưa):
```bash
npm install
```

3. Cấu hình database trong file `.env`:
```
DATABASE_URL="postgresql://user:password@host:port/database"
PORT=3000
```

4. Chạy migration (nếu chưa):
```bash
npx prisma migrate dev
```

5. Khởi động server:
```bash
npm start
```

Server sẽ chạy tại: http://localhost:3000

### Frontend

1. Di chuyển vào thư mục frontend:
```bash
cd fe
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình API URL trong file `.env`:
```
REACT_APP_API_URL=http://localhost:3000/api
PORT=3001
```

4. Khởi động development server:
```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3001

## Kiểm thử

### Test Backend API

#### 1. Test lấy danh sách đề tài
```bash
curl http://localhost:3000/api/topics
```

#### 2. Test tìm kiếm đề tài
```bash
curl "http://localhost:3000/api/topics?keyword=AI&fieldId=1"
```

#### 3. Test lấy chi tiết đề tài
```bash
curl http://localhost:3000/api/topics/1
```

#### 4. Test kiểm tra khả năng đăng ký
```bash
curl http://localhost:3000/api/topics/1/availability
```

#### 5. Test lấy danh sách lĩnh vực
```bash
curl http://localhost:3000/api/fields
```

### Test Frontend

1. Mở trình duyệt: http://localhost:3001
2. Kiểm tra danh sách đề tài hiển thị
3. Test tìm kiếm bằng từ khóa
4. Test lọc theo lĩnh vực
5. Test lọc theo trạng thái
6. Test phân trang
7. Click vào card để xem chi tiết đề tài
8. Kiểm tra nút "Đăng ký đề tài" (sẽ chuyển sang màn hình của Thành viên 2)

## Tích hợp với các thành viên khác

### Với Thành viên 2 (Tạo nhóm)
- Khi người dùng click "Đăng ký đề tài" ở trang chi tiết, chuyển sang màn hình tạo nhóm
- Route: `/register-topic/:topicId`

### Với Thành viên 5 (Validation & Notification)
- Sử dụng validation service để kiểm tra dữ liệu
- Hiển thị thông báo lỗi từ backend

## Cấu trúc dữ liệu

### Bảng de_tai_nghien_cuu
- de_tai_id (PK)
- ma_de_tai
- ten_de_tai
- linh_vuc_id (FK)
- mo_ta
- muc_tieu
- yeu_cau
- so_luong_thanh_vien_toi_da
- giang_vien_huong_dan_id (FK)
- trang_thai
- nam_hoc
- hoc_ky

### Bảng linh_vuc_nghien_cuu
- linh_vuc_id (PK)
- ma_linh_vuc
- ten_linh_vuc
- mo_ta
- trang_thai

## Trạng thái đề tài
- `MO_DANG_KY`: Đề tài đang mở đăng ký
- `DANG_THUC_HIEN`: Đề tài đang được thực hiện
- `HOAN_THANH`: Đề tài đã hoàn thành
- `DONG`: Đề tài đã đóng

## Lưu ý kỹ thuật

1. **Phân trang**: Sử dụng skip/take của Prisma
2. **Tìm kiếm**: Sử dụng contains với mode insensitive
3. **Filter**: Kết hợp nhiều điều kiện trong where clause
4. **Performance**: Sử dụng include để eager loading quan hệ
5. **Error handling**: Bắt lỗi ở mọi layer (controller, service, repository)

## Checklist hoàn thành

### Backend
- [x] Controller cho đề tài
- [x] Controller cho lĩnh vực
- [x] Service cho đề tài
- [x] Service cho lĩnh vực
- [x] Repository cho đề tài
- [x] Repository cho lĩnh vực
- [x] Routes cho đề tài
- [x] Routes cho lĩnh vực
- [x] Tích hợp vào index.js

### Frontend
- [x] Component TopicList
- [x] Component TopicCard
- [x] Component TopicDetail
- [x] Component SearchBar
- [x] Component FilterPanel
- [x] Component Pagination
- [x] API Service
- [x] Styles cho tất cả components
- [x] Tích hợp React Router
- [x] Cấu hình .env

### Testing
- [ ] Test API với Postman/curl
- [ ] Test UI trên trình duyệt
- [ ] Test tìm kiếm và lọc
- [ ] Test phân trang
- [ ] Test responsive design
- [ ] Test tích hợp với backend

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Backend server đã chạy chưa (port 3000)
2. Frontend server đã chạy chưa (port 3001)
3. Database đã được migrate chưa
4. File .env đã được cấu hình đúng chưa
5. Dependencies đã được cài đặt đầy đủ chưa

## Tài liệu tham khảo
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Express.js Documentation](https://expressjs.com)
