# Mô tả kiến trúc hệ thống

## 1. Tổng quan
Hệ thống **Quản lý nghiên cứu khoa học sinh viên** được thiết kế theo mô hình **Layered Architecture (Kiến trúc phân lớp)** kết hợp với mô hình **Client–Server**.

Mục tiêu của kiến trúc này là:
- tách biệt rõ giao diện, xử lý nghiệp vụ và lưu trữ dữ liệu;
- giúp hệ thống dễ bảo trì, dễ mở rộng và dễ triển khai;
- phù hợp với bài toán quản lý nghiên cứu khoa học có nhiều vai trò sử dụng như sinh viên, giảng viên, cán bộ quản lý, hội đồng và quản trị hệ thống.

Ngăn xếp công nghệ được sử dụng:
- **Frontend:** React
- **Backend:** NodeJS
- **Database:** PostgreSQL
- **Triển khai:** Docker (hỗ trợ đóng gói và triển khai)

---

## 2. Kiểu kiến trúc được sử dụng

### 2.1. Client–Server
Hệ thống được xây dựng theo mô hình **Client–Server**, trong đó:

- **Client** là ứng dụng web chạy trên trình duyệt, được xây dựng bằng **React**.
- **Server** là ứng dụng phía máy chủ, được xây dựng bằng **NodeJS**, chịu trách nhiệm tiếp nhận yêu cầu từ client, xử lý nghiệp vụ và truy cập cơ sở dữ liệu.
- **Database Server** là **PostgreSQL**, dùng để lưu trữ tập trung toàn bộ dữ liệu hệ thống.

Mô hình này giúp phân tách rõ phần hiển thị với phần xử lý, cho phép nhiều người dùng truy cập đồng thời qua trình duyệt web.

### 2.2. Layered Architecture
Bên trong phía server, hệ thống tiếp tục được tổ chức theo **Kiến trúc phân lớp**, giúp chia hệ thống thành các tầng độc lập, mỗi tầng có trách nhiệm riêng.

Ba tầng chính gồm:

1. **Presentation Layer**
2. **Application Layer**
3. **Data Layer**

---

## 3. Các tầng trong kiến trúc

### 3.1. Presentation Layer
Đây là tầng giao diện người dùng, được xây dựng bằng **React**.

Nhiệm vụ chính:
- hiển thị dữ liệu cho người dùng;
- nhận thao tác từ người dùng;
- gửi request đến backend qua API;
- hiển thị kết quả xử lý, thông báo lỗi, trạng thái nghiệp vụ.

Các màn hình tiêu biểu:
- đăng nhập hệ thống;
- quản lý tài khoản;
- đăng ký đề tài nghiên cứu;
- nộp đề cương;
- báo cáo tiến độ;
- tổ chức bảo vệ đề tài;
- đánh giá, chấm điểm;
- thống kê và báo cáo.

Tầng này **không nên chứa nghiệp vụ phức tạp**; nhiệm vụ chính là tương tác với người dùng và gọi API.

### 3.2. Application Layer
Đây là tầng xử lý nghiệp vụ, được xây dựng bằng **NodeJS**.

Nhiệm vụ chính:
- tiếp nhận request từ frontend;
- kiểm tra dữ liệu đầu vào;
- thực hiện xác thực và phân quyền;
- xử lý các quy tắc nghiệp vụ;
- điều phối luồng xử lý giữa các module;
- trả dữ liệu kết quả về frontend.

Ví dụ nghiệp vụ tại tầng này:
- kiểm tra đăng nhập hợp lệ;
- phân quyền theo vai trò;
- kiểm tra trùng lặp đề tài;
- kiểm tra số lượng thành viên nhóm;
- kiểm tra điều kiện phê duyệt đề cương;
- kiểm tra trùng lịch bảo vệ;
- tính điểm và lưu kết quả đánh giá;
- gửi thông báo cho các bên liên quan.

Có thể tách tầng này thành các module nhỏ như:
- Auth / Account
- Sinh viên
- Giảng viên
- Đề tài nghiên cứu
- Đề cương
- Tiến độ
- Hội đồng
- Lịch bảo vệ
- Đánh giá chấm điểm
- Thống kê báo cáo
- Thông báo

### 3.3. Data Layer
Đây là tầng lưu trữ dữ liệu, sử dụng **PostgreSQL**.

Nhiệm vụ chính:
- lưu trữ dữ liệu tập trung;
- cung cấp cơ chế truy vấn, thêm, sửa, xóa dữ liệu;
- đảm bảo toàn vẹn dữ liệu;
- hỗ trợ ràng buộc khóa chính, khóa ngoại và các quan hệ giữa các bảng.

Một số nhóm dữ liệu chính:
- người dùng, tài khoản, vai trò;
- sinh viên, giảng viên, khoa;
- đề tài, nhóm nghiên cứu, hồ sơ đăng ký;
- đề cương, báo cáo tiến độ, báo cáo cuối cùng;
- hội đồng khoa học, thành viên hội đồng, lịch bảo vệ;
- đánh giá chấm điểm, thông báo, tệp đính kèm.

---

## 4. Luồng xử lý tổng quát
Luồng hoạt động của hệ thống có thể mô tả như sau:

1. Người dùng thao tác trên giao diện React.
2. Frontend gửi request đến API NodeJS.
3. Backend kiểm tra xác thực, phân quyền và dữ liệu đầu vào.
4. Backend xử lý nghiệp vụ.
5. Backend truy cập PostgreSQL để đọc/ghi dữ liệu.
6. Kết quả được trả lại frontend.
7. Frontend hiển thị kết quả cho người dùng.

Ví dụ với nghiệp vụ **Đăng ký đề tài nghiên cứu**:
- sinh viên mở màn hình đăng ký đề tài;
- React gửi request lấy danh sách đề tài và giảng viên;
- NodeJS kiểm tra dữ liệu, số lượng thành viên, trùng đề tài;
- PostgreSQL lưu hồ sơ đăng ký;
- backend trả kết quả thành công/thất bại;
- frontend hiển thị trạng thái “chờ phê duyệt” hoặc thông báo lỗi.

---

## 5. Sơ đồ khái quát kiến trúc
```text
Người dùng
   |
   v
[ React Frontend / Presentation Layer ]
   |
   | HTTP / REST API
   v
[ NodeJS Backend / Application Layer ]
   |
   | Query / Transaction
   v
[ PostgreSQL Database / Data Layer ]
```

Nếu triển khai bằng Docker, toàn bộ các thành phần có thể được đóng gói thành các container riêng:
- container frontend;
- container backend;
- container database.

---

## 6. Lý do lựa chọn kiến trúc này
Kiến trúc phân lớp kết hợp Client–Server phù hợp với hệ thống vì:

### 6.1. Phù hợp với bài toán web-based
Hệ thống phục vụ nhiều người dùng ở nhiều vai trò khác nhau, truy cập qua trình duyệt web. Vì vậy, mô hình Client–Server là phù hợp và dễ triển khai trong môi trường học thuật.

### 6.2. Dễ bảo trì
Do các tầng được tách biệt rõ ràng, việc thay đổi giao diện không ảnh hưởng trực tiếp đến backend hoặc database. Ngược lại, thay đổi logic nghiệp vụ cũng không bắt buộc sửa frontend quá nhiều nếu API được thiết kế ổn định.

### 6.3. Dễ mở rộng
Khi hệ thống cần thêm chức năng mới như quản lý giải thưởng nghiên cứu, công bố khoa học hoặc tích hợp email, có thể mở rộng ở tầng backend và database mà không làm thay đổi toàn bộ kiến trúc.

### 6.4. Đảm bảo bảo mật và phân quyền
Tầng backend tập trung xử lý xác thực, phân quyền theo vai trò và kiểm tra truy cập dữ liệu. Điều này phù hợp với yêu cầu bảo mật của hệ thống quản lý nghiên cứu khoa học.

### 6.5. Hỗ trợ hiệu năng và triển khai
Frontend React cho trải nghiệm tương tác tốt; NodeJS phù hợp cho xây dựng API web; PostgreSQL mạnh về quản lý dữ liệu quan hệ; Docker giúp triển khai đồng nhất giữa các môi trường.

---

## 7. Liên hệ kiến trúc với yêu cầu phi chức năng

### 7.1. Bảo mật (Security)
- Backend kiểm soát xác thực và phân quyền theo vai trò.
- Mật khẩu có thể được mã hóa bằng Bcrypt trước khi lưu vào cơ sở dữ liệu.
- Dữ liệu chỉ được truy cập thông qua API được kiểm soát.

### 7.2. Độ tin cậy (Reliability)
- Dữ liệu được lưu tập trung trong PostgreSQL.
- Các giao dịch nghiệp vụ quan trọng có thể được xử lý theo transaction để tránh sai lệch dữ liệu.

### 7.3. Hiệu năng (Performance)
- Frontend và backend tách riêng nên dễ tối ưu từng phần.
- Database quan hệ hỗ trợ truy vấn dữ liệu có cấu trúc tốt.

### 7.4. Bảo trì (Maintainability)
- Đây là lợi ích nổi bật nhất của Layered Architecture.
- Mỗi tầng có nhiệm vụ riêng, làm cho hệ thống dễ sửa đổi và nâng cấp.

### 7.5. Khả chuyển (Portability)
- Hệ thống là web application nên có thể truy cập trên nhiều hệ điều hành.
- Docker giúp chuyển môi trường triển khai dễ dàng hơn.

---

## 8. Đề xuất tổ chức thư mục mã nguồn

### 8.1. Frontend (React)
```text
frontend/
  src/
    components/
    pages/
    layouts/
    services/
    hooks/
    utils/
    routes/
```

### 8.2. Backend (NodeJS)
```text
backend/
  src/
    controllers/
    services/
    repositories/
    models/
    middlewares/
    routes/
    utils/
    configs/
```

Cách tổ chức này vẫn bám theo tư tưởng phân lớp:
- `controllers`: tiếp nhận request;
- `services`: xử lý nghiệp vụ;
- `repositories/models`: làm việc với dữ liệu;
- `middlewares`: xác thực, phân quyền, validate;
- `routes`: định tuyến API.

---

## 9. Kết luận
Kiến trúc của hệ thống là **Layered Architecture kết hợp Client–Server**, sử dụng **React + NodeJS + PostgreSQL** và có hỗ trợ **Docker** để triển khai.

Đây là kiến trúc phù hợp với hệ thống quản lý nghiên cứu khoa học sinh viên vì:
- rõ ràng về trách nhiệm giữa các thành phần;
- thuận lợi cho phát triển theo nhóm;
- dễ bảo trì và mở rộng;
- đáp ứng tốt các yêu cầu phi chức năng như bảo mật, hiệu năng, bảo trì và khả chuyển.
