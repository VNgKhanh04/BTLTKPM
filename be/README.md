# Hệ thống Quản lý Nghiên cứu Khoa học

API REST để quản lý nhà nghiên cứu, dự án và công bố khoa học.

## Cài đặt

```bash
npm install
```

## Cấu hình

Chỉnh sửa file `.env` để cấu hình kết nối MongoDB và port.

## Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Nhà nghiên cứu
- GET `/api/researchers` - Lấy danh sách
- POST `/api/researchers` - Tạo mới
- GET `/api/researchers/:id` - Lấy theo ID
- PUT `/api/researchers/:id` - Cập nhật
- DELETE `/api/researchers/:id` - Xóa

### Dự án
- GET `/api/projects` - Lấy danh sách
- POST `/api/projects` - Tạo mới
- GET `/api/projects/:id` - Lấy theo ID
- PUT `/api/projects/:id` - Cập nhật
- DELETE `/api/projects/:id` - Xóa

### Công bố
- GET `/api/publications` - Lấy danh sách
- POST `/api/publications` - Tạo mới
- GET `/api/publications/:id` - Lấy theo ID
- PUT `/api/publications/:id` - Cập nhật
- DELETE `/api/publications/:id` - Xóa
