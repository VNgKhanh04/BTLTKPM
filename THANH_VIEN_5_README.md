# Thành viên 5: Validation & Thông báo

## 📋 Tổng quan

Thành viên 5 phụ trách phát triển chức năng validation và thông báo, bao gồm:
- Kiểm tra tính hợp lệ của hồ sơ đăng ký
- Kiểm tra trùng lặp đề tài
- Quản lý thông báo hệ thống
- Hiển thị lỗi và cảnh báo
- Toast notifications

---

## 🎯 Chức năng đã triển khai

### Backend (Node.js + Prisma)

#### 1. Validation

**Controllers** (`be/src/controllers/validationController.js`)
- ✅ `validateHoSoDangKy()` - Validate hồ sơ đăng ký
- ✅ `getDanhSachLoi()` - Lấy danh sách lỗi
- ✅ `kiemTraTrungDeTai()` - Kiểm tra trùng đề tài

**Services** (`be/src/services/validationService.js`)
- ✅ `validateHoSoDangKy()` - Logic validation đầy đủ
- ✅ `kiemTraTrungDeTai()` - Logic kiểm tra trùng lặp
- ✅ `getDanhSachLoi()` - Logic lấy lỗi từ phê duyệt

**Routes** (`be/src/routes/validation.js`)
- ✅ `POST /api/validation/topic-registration`
- ✅ `GET /api/validation/registration/:id/errors`
- ✅ `POST /api/validation/topic/:id/check-duplicate`

#### 2. Thông báo

**Controllers** (`be/src/controllers/thongBaoController.js`)
- ✅ `getDanhSachThongBao()` - Lấy danh sách thông báo
- ✅ `taoThongBao()` - Tạo thông báo
- ✅ `danhDauDaDoc()` - Đánh dấu đã đọc
- ✅ `demThongBaoChuaDoc()` - Đếm chưa đọc

**Services** (`be/src/services/thongBaoService.js`)
- ✅ `getDanhSachThongBao()` - Logic lấy danh sách
- ✅ `taoThongBao()` - Logic tạo thông báo
- ✅ `danhDauDaDoc()` - Logic đánh dấu đã đọc
- ✅ `demThongBaoChuaDoc()` - Logic đếm

**Repositories** (`be/src/repositories/thongBaoRepository.js`)
- ✅ `findMany()` - Query danh sách với filter
- ✅ `findById()` - Query chi tiết
- ✅ `create()` - Tạo thông báo
- ✅ `update()` - Cập nhật thông báo
- ✅ `countUnread()` - Đếm chưa đọc
- ✅ `markAllAsRead()` - Đánh dấu tất cả đã đọc

**Routes** (`be/src/routes/thongBao.js`)
- ✅ `GET /api/notifications`
- ✅ `POST /api/notifications`
- ✅ `PATCH /api/notifications/:id/read`
- ✅ `GET /api/notifications/unread-count`

### Frontend (React)

#### 1. Components

**NotificationList.js** - Danh sách thông báo
- ✅ Hiển thị danh sách thông báo
- ✅ Filter: Tất cả / Chưa đọc / Đã đọc
- ✅ Badge số lượng chưa đọc
- ✅ Auto refresh
- ✅ Loading & error states

**NotificationItem.js** - Item thông báo
- ✅ Icon theo loại thông báo
- ✅ Badge "Mới" cho chưa đọc
- ✅ Format thời gian relative
- ✅ Click để đánh dấu đã đọc
- ✅ Navigate đến đường dẫn

**Toast.js** - Toast notifications
- ✅ Toast component với 4 types
- ✅ ToastContainer quản lý nhiều toast
- ✅ Auto dismiss sau duration
- ✅ Animation slide in
- ✅ Manual close button

#### 2. Services (`fe/src/services/api.js`)
- ✅ `notificationAPI.getList()`
- ✅ `notificationAPI.create()`
- ✅ `notificationAPI.markAsRead()`
- ✅ `notificationAPI.getUnreadCount()`
- ✅ `validationAPI.validateRegistration()`
- ✅ `validationAPI.getErrors()`
- ✅ `validationAPI.checkDuplicate()`

#### 3. Styles
- ✅ `NotificationList.css`
- ✅ `NotificationItem.css`
- ✅ `Toast.css`

#### 4. Routing
- ✅ Route `/notifications` - Trang thông báo

---

## 🗂️ Cấu trúc file

```
be/
├── src/
│   ├── controllers/
│   │   ├── validationController.js         ✅ Validation controller
│   │   └── thongBaoController.js           ✅ Notification controller
│   ├── services/
│   │   ├── validationService.js            ✅ Validation logic
│   │   └── thongBaoService.js              ✅ Notification logic
│   ├── repositories/
│   │   └── thongBaoRepository.js           ✅ Notification queries
│   └── routes/
│       ├── validation.js                   ✅ Validation routes
│       └── thongBao.js                     ✅ Notification routes

fe/
├── src/
│   ├── components/
│   │   ├── NotificationList.js             ✅ List component
│   │   ├── NotificationItem.js             ✅ Item component
│   │   └── Toast.js                        ✅ Toast component
│   ├── services/
│   │   └── api.js                          ✅ APIs added
│   └── styles/
│       ├── NotificationList.css            ✅ List styles
│       ├── NotificationItem.css            ✅ Item styles
│       └── Toast.css                       ✅ Toast styles
```

---

## 🚀 Hướng dẫn chạy

### 1. Backend đã tích hợp

Routes đã được mount trong `be/src/index.js`

### 2. Khởi động

```bash
# Backend
cd be
npm start

# Frontend
cd fe
npm start
```

---

## 📡 API Endpoints

### Validation APIs

#### 1. POST /api/validation/topic-registration

Validate hồ sơ đăng ký trước khi nộp.

Request:
```json
{
  "nhomId": 1,
  "deTaiId": 1
}
```

Response:
```json
{
  "valid": false,
  "errors": [
    {
      "field": "nhomId",
      "message": "Nhóm chưa có giảng viên hướng dẫn"
    }
  ]
}
```

#### 2. POST /api/validation/topic/:id/check-duplicate

Kiểm tra đề tài đã có nhóm khác đăng ký chưa.

Response:
```json
{
  "available": true,
  "reason": null
}
```

### Notification APIs

#### 1. GET /api/notifications

Query params:
- `nguoiNhanId` - ID người nhận
- `loaiNguoiNhan` - SINH_VIEN / GIANG_VIEN
- `daDoc` - true / false

Response:
```json
[
  {
    "thong_bao_id": 1,
    "tieu_de": "Hồ sơ đăng ký đề tài",
    "noi_dung": "Hồ sơ của bạn đã được phê duyệt",
    "loai_thong_bao": "PHE_DUYET",
    "da_doc": false,
    "thoi_gian_gui": "2024-03-29T..."
  }
]
```

#### 2. PATCH /api/notifications/:id/read

Đánh dấu thông báo đã đọc.

#### 3. GET /api/notifications/unread-count

Response:
```json
{
  "count": 5
}
```

---

## 🎨 Giao diện người dùng

### Loại thông báo

| Loại | Icon | Màu | Mô tả |
|------|------|-----|-------|
| DANG_KY_DE_TAI | 📝 | Blue | Đăng ký đề tài |
| PHE_DUYET | ✅ | Green | Phê duyệt |
| TU_CHOI | ❌ | Red | Từ chối |
| CAN_CHINH_SUA | ✏️ | Yellow | Cần chỉnh sửa |
| THONG_BAO_CHUNG | 📢 | Gray | Thông báo chung |
| NHAC_NHO | ⏰ | Orange | Nhắc nhở |

### Toast types

- `success` - Màu xanh lá, icon ✓
- `error` - Màu đỏ, icon ✕
- `warning` - Màu vàng, icon ⚠
- `info` - Màu xanh dương, icon ℹ

---

## 🔍 Validation Rules

### Hồ sơ đăng ký

1. **Nhóm nghiên cứu**
   - Phải tồn tại
   - Phải có giảng viên hướng dẫn
   - Phải có ít nhất 1 thành viên

2. **Đề tài**
   - Phải tồn tại
   - Phải ở trạng thái MO_DANG_KY
   - Không được trùng với nhóm khác

3. **Lý do chọn đề tài**
   - Bắt buộc nhập
   - Tối thiểu 50 ký tự (khuyến nghị)

---

## 🧪 Test với cURL

### Validation

```bash
# Validate hồ sơ
curl -X POST http://localhost:3000/api/validation/topic-registration \
  -H "Content-Type: application/json" \
  -d '{
    "nhomId": 1,
    "deTaiId": 1
  }'

# Kiểm tra trùng đề tài
curl -X POST http://localhost:3000/api/validation/topic/1/check-duplicate \
  -H "Content-Type: application/json" \
  -d '{"nhomId": 1}'

# Lấy danh sách lỗi
curl http://localhost:3000/api/validation/registration/1/errors
```

### Notifications

```bash
# Lấy danh sách thông báo
curl "http://localhost:3000/api/notifications?nguoiNhanId=1&loaiNguoiNhan=SINH_VIEN"

# Lấy thông báo chưa đọc
curl "http://localhost:3000/api/notifications?nguoiNhanId=1&loaiNguoiNhan=SINH_VIEN&daDoc=false"

# Tạo thông báo
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "tieu_de": "Test notification",
    "noi_dung": "This is a test",
    "nguoi_nhan_id": 1,
    "loai_nguoi_nhan": "SINH_VIEN",
    "loai_thong_bao": "THONG_BAO_CHUNG"
  }'

# Đánh dấu đã đọc
curl -X PATCH http://localhost:3000/api/notifications/1/read

# Đếm chưa đọc
curl "http://localhost:3000/api/notifications/unread-count?nguoiNhanId=1&loaiNguoiNhan=SINH_VIEN"
```

---

## 🔗 Tích hợp với các thành viên khác

### Sử dụng Validation

Các thành viên khác có thể sử dụng validation trước khi submit:

```javascript
import { validationAPI } from './services/api';

// Validate trước khi nộp hồ sơ
const result = await validationAPI.validateRegistration({
  nhomId: 1,
  deTaiId: 1
});

if (!result.valid) {
  // Hiển thị errors
  result.errors.forEach(error => {
    console.log(`${error.field}: ${error.message}`);
  });
}
```

### Sử dụng Toast

```javascript
import { useState } from 'react';
import { ToastContainer } from './components/Toast';

function MyComponent() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type, duration: 3000 }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  // Sử dụng
  showToast('Đăng ký thành công!', 'success');
  showToast('Có lỗi xảy ra', 'error');

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Your content */}
    </>
  );
}
```

---

## ✅ Checklist hoàn thành

### Backend
- [x] Controllers: validation & thongBao
- [x] Services: validation & thongBao
- [x] Repository: thongBao
- [x] Routes: validation & thongBao
- [x] Integration: index.js

### Frontend
- [x] Component: NotificationList
- [x] Component: NotificationItem
- [x] Component: Toast
- [x] Services: notificationAPI & validationAPI
- [x] Styles: All CSS files
- [x] Routing: App.js

### Documentation
- [x] README: THANH_VIEN_5_README.md

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Manual testing

---

## 📝 Ghi chú

### Điểm mạnh

1. **Validation đầy đủ**
   - Kiểm tra tất cả điều kiện
   - Error messages rõ ràng
   - Có thể tái sử dụng

2. **Thông báo linh hoạt**
   - Nhiều loại thông báo
   - Filter và search
   - Real-time updates

3. **UX tốt**
   - Toast cho feedback nhanh
   - Notification center đầy đủ
   - Visual indicators rõ ràng

### Cải tiến có thể làm

1. **Real-time notifications**
   - WebSocket cho push notifications
   - Auto refresh khi có thông báo mới

2. **Advanced validation**
   - Async validation
   - Custom validation rules
   - Validation schemas

3. **Notification preferences**
   - User settings cho loại thông báo
   - Email notifications
   - Push notifications

---

**Hoàn thành:** 29/03/2024
**Người thực hiện:** Kiro AI Assistant
