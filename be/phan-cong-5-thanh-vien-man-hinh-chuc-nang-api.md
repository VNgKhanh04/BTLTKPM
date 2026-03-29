# Phân công 5 thành viên: màn hình, chức năng, API

## 1. Nguyên tắc phân công

Do nhóm muốn mỗi thành viên đều tham gia cả **Backend (BE)** và **Frontend (FE)**, cách chia phù hợp nhất là chia theo **màn hình / chức năng nghiệp vụ** thay vì chia theo công nghệ.

Nghiệp vụ trọng tâm được chọn là **Đăng ký đề tài nghiên cứu** vì đây là use case có mức ưu tiên cao, đồng thời là đầu vào cho các nghiệp vụ tiếp theo như phê duyệt đề tài, nộp đề cương, báo cáo tiến độ và bảo vệ đề tài.

Mỗi thành viên sẽ phụ trách:
- 1 nhóm màn hình chính
- 1 nhóm chức năng nghiệp vụ tương ứng
- 1 tập API Backend
- phần kiểm thử và tích hợp cho phần mình phụ trách

---

## 2. Công nghệ áp dụng

- **Frontend:** React
- **Backend:** NodeJS
- **Database:** PostgreSQL
- **Kiến trúc:** Layered Architecture kết hợp Client–Server

---

## 3. Phân công chi tiết cho 5 thành viên

### Thành viên 1: Màn hình danh sách đề tài và tìm kiếm đề tài

#### Màn hình phụ trách
- Trang danh sách đề tài nghiên cứu
- Form tìm kiếm đề tài
- Bộ lọc theo lĩnh vực, trạng thái, giảng viên hướng dẫn
- Trang chi tiết đề tài

#### Chức năng phụ trách
- Hiển thị danh sách đề tài đang mở đăng ký
- Tìm kiếm đề tài theo tên
- Lọc đề tài theo lĩnh vực
- Xem chi tiết đề tài
- Kiểm tra đề tài còn khả năng đăng ký hay không

#### API Backend phụ trách
- `GET /api/topics`
  - Lấy danh sách đề tài
- `GET /api/topics/:id`
  - Lấy chi tiết đề tài
- `GET /api/topics?keyword=&fieldId=&status=`
  - Tìm kiếm và lọc đề tài
- `GET /api/fields`
  - Lấy danh sách lĩnh vực

#### Frontend phụ trách
- Bảng danh sách đề tài
- Ô tìm kiếm
- Dropdown lọc lĩnh vực
- Nút xem chi tiết đề tài
- Phân trang danh sách đề tài

#### Kết quả bàn giao
- Giao diện danh sách đề tài hoàn chỉnh
- API tìm kiếm/lọc chạy ổn định
- Người dùng có thể chọn được đề tài phù hợp để đăng ký

---

### Thành viên 2: Màn hình tạo nhóm đăng ký đề tài

#### Màn hình phụ trách
- Form tạo nhóm nghiên cứu
- Form chọn trưởng nhóm
- Form thêm/xóa thành viên nhóm
- Màn hình xem thông tin nhóm trước khi nộp

#### Chức năng phụ trách
- Tạo nhóm đăng ký đề tài
- Chọn trưởng nhóm
- Thêm thành viên vào nhóm
- Xóa thành viên khỏi nhóm
- Kiểm tra số lượng thành viên tối đa
- Kiểm tra sinh viên có đủ điều kiện tham gia nhóm hay không

#### API Backend phụ trách
- `POST /api/research-groups`
  - Tạo nhóm nghiên cứu
- `GET /api/students/search?keyword=`
  - Tìm sinh viên để thêm vào nhóm
- `POST /api/research-groups/:id/members`
  - Thêm thành viên vào nhóm
- `DELETE /api/research-groups/:id/members/:studentId`
  - Xóa thành viên khỏi nhóm
- `GET /api/research-groups/:id`
  - Xem chi tiết nhóm

#### Frontend phụ trách
- Form nhập tên nhóm
- Giao diện chọn trưởng nhóm
- Giao diện thêm/xóa thành viên
- Hiển thị danh sách thành viên hiện tại
- Hiển thị lỗi khi vượt số lượng thành viên cho phép

#### Kết quả bàn giao
- Nhóm nghiên cứu được tạo thành công
- Quản lý thành viên nhóm đầy đủ
- Có validate rõ ràng ở cả BE và FE

---

### Thành viên 3: Màn hình chọn giảng viên hướng dẫn

#### Màn hình phụ trách
- Danh sách giảng viên hướng dẫn
- Bộ lọc giảng viên theo chuyên môn
- Trang chi tiết giảng viên
- Màn hình chọn giảng viên cho đề tài

#### Chức năng phụ trách
- Hiển thị danh sách giảng viên có thể hướng dẫn
- Tìm giảng viên theo tên hoặc chuyên môn
- Kiểm tra số lượng sinh viên/đề tài mà giảng viên đang hướng dẫn
- Chọn giảng viên phù hợp cho đề tài
- Cảnh báo khi giảng viên đã đủ số lượng hướng dẫn

#### API Backend phụ trách
- `GET /api/lecturers`
  - Lấy danh sách giảng viên
- `GET /api/lecturers/:id`
  - Lấy chi tiết giảng viên
- `GET /api/lecturers?specialization=&keyword=`
  - Tìm kiếm/lọc giảng viên
- `GET /api/lecturers/:id/quota`
  - Kiểm tra quota hướng dẫn
- `PUT /api/research-groups/:id/advisor`
  - Gán giảng viên hướng dẫn cho nhóm

#### Frontend phụ trách
- Danh sách giảng viên
- Card/thẻ thông tin giảng viên
- Hiển thị chuyên môn và số lượng còn nhận hướng dẫn
- Nút chọn giảng viên hướng dẫn
- Hiển thị trạng thái còn chỗ / đã đủ quota

#### Kết quả bàn giao
- Người dùng chọn được giảng viên hợp lệ
- Hệ thống kiểm tra quota và chuyên môn đầy đủ
- Giao diện trực quan, dễ dùng

---

### Thành viên 4: Màn hình nộp hồ sơ đăng ký đề tài

#### Màn hình phụ trách
- Màn hình tổng hợp hồ sơ đăng ký
- Màn hình xác nhận nộp đăng ký
- Màn hình xem trạng thái hồ sơ đăng ký
- Màn hình lịch sử các lần đăng ký/chỉnh sửa

#### Chức năng phụ trách
- Tổng hợp thông tin đề tài + nhóm + giảng viên
- Nộp hồ sơ đăng ký đề tài
- Lưu trạng thái hồ sơ: chờ phê duyệt / cần chỉnh sửa / đã duyệt / từ chối
- Cho phép xem lại thông tin hồ sơ đã nộp
- Cho phép cập nhật hồ sơ trước khi được duyệt (nếu nghiệp vụ cho phép)

#### API Backend phụ trách
- `POST /api/topic-registrations`
  - Tạo hồ sơ đăng ký đề tài
- `GET /api/topic-registrations/:id`
  - Xem chi tiết hồ sơ đăng ký
- `GET /api/topic-registrations?studentId=`
  - Xem danh sách hồ sơ của sinh viên/nhóm
- `PUT /api/topic-registrations/:id`
  - Cập nhật hồ sơ đăng ký
- `PATCH /api/topic-registrations/:id/submit`
  - Xác nhận nộp hồ sơ

#### Frontend phụ trách
- Trang review toàn bộ hồ sơ trước khi nộp
- Nút xác nhận nộp hồ sơ
- Trang theo dõi trạng thái hồ sơ
- Hiển thị timeline trạng thái đăng ký
- Giao diện chỉnh sửa hồ sơ khi bị yêu cầu bổ sung

#### Kết quả bàn giao
- Luồng nộp hồ sơ hoàn chỉnh
- Trạng thái hồ sơ hiển thị rõ ràng
- Có thể theo dõi tiến trình xử lý hồ sơ

---

### Thành viên 5: Kiểm tra điều kiện đăng ký, thông báo và xử lý lỗi

#### Màn hình phụ trách
- Màn hình thông báo kết quả đăng ký
- Popup/cảnh báo lỗi nghiệp vụ
- Màn hình danh sách thông báo
- Màn hình hiển thị lý do từ chối hoặc yêu cầu chỉnh sửa

#### Chức năng phụ trách
- Kiểm tra trùng lặp đề tài
- Kiểm tra đề tài đã có nhóm khác đăng ký chưa
- Kiểm tra dữ liệu đầu vào hợp lệ trước khi nộp
- Gửi thông báo khi đăng ký thành công
- Gửi thông báo khi hồ sơ bị từ chối hoặc yêu cầu chỉnh sửa
- Chuẩn hóa message lỗi trả về từ backend

#### API Backend phụ trách
- `POST /api/topic-registrations/validate`
  - Kiểm tra tính hợp lệ của hồ sơ trước khi nộp
- `GET /api/notifications`
  - Lấy danh sách thông báo
- `POST /api/notifications`
  - Tạo thông báo hệ thống
- `PATCH /api/notifications/:id/read`
  - Đánh dấu đã đọc
- `GET /api/topic-registrations/:id/errors`
  - Lấy danh sách lỗi/nguyên nhân từ chối nếu có

#### Frontend phụ trách
- Hiển thị toast thông báo
- Hiển thị popup lỗi validate
- Trang danh sách thông báo
- Trang chi tiết thông báo
- Hiển thị lý do hồ sơ bị từ chối / yêu cầu chỉnh sửa

#### Kết quả bàn giao
- Hệ thống báo lỗi rõ ràng, dễ hiểu
- Người dùng biết hồ sơ sai ở đâu để sửa
- Có thông báo đầy đủ trong toàn bộ luồng đăng ký

---

## 4. Bảng tổng hợp phân công

| Thành viên | Màn hình chính | Chức năng chính | API chính |
|---|---|---|---|
| Thành viên 1 | Danh sách đề tài | Tìm kiếm, lọc, xem chi tiết đề tài | `/api/topics`, `/api/fields` |
| Thành viên 2 | Tạo nhóm nghiên cứu | Tạo nhóm, thêm/xóa thành viên | `/api/research-groups` |
| Thành viên 3 | Chọn giảng viên hướng dẫn | Tìm kiếm GV, kiểm tra quota, gán GV | `/api/lecturers`, `/api/research-groups/:id/advisor` |
| Thành viên 4 | Nộp hồ sơ đăng ký | Tạo hồ sơ, nộp hồ sơ, xem trạng thái | `/api/topic-registrations` |
| Thành viên 5 | Thông báo và validate | Kiểm tra điều kiện, báo lỗi, gửi thông báo | `/api/topic-registrations/validate`, `/api/notifications` |

---

## 5. Cách phối hợp để tránh chồng chéo

### 5.1. Thống nhất chung trước khi code
Cả nhóm cần thống nhất trước các nội dung sau:
- Quy ước đặt tên API
- Cấu trúc response JSON
- Quy tắc validate dữ liệu
- Cấu trúc thư mục React
- Quy tắc phân tầng trong NodeJS
- Quy ước đặt tên component, service, controller

### 5.2. Thứ tự triển khai đề xuất
1. Thành viên 1 làm danh sách đề tài để có dữ liệu đầu vào.
2. Thành viên 2 làm nhóm nghiên cứu.
3. Thành viên 3 làm chọn giảng viên.
4. Thành viên 4 ghép các phần trên thành hồ sơ đăng ký hoàn chỉnh.
5. Thành viên 5 bổ sung validate, thông báo, xử lý lỗi và hỗ trợ test tích hợp.

### 5.3. Nguyên tắc kiểm thử
- Mỗi người tự test API của phần mình bằng Postman/Swagger.
- Mỗi người test giao diện FE với dữ liệu thật từ BE.
- Cuối cùng test toàn bộ luồng:
  - Chọn đề tài
  - Tạo nhóm
  - Chọn giảng viên
  - Nộp hồ sơ
  - Hiển thị thông báo / lỗi

---

## 6. Kết luận

Cách chia theo **màn hình + chức năng + API** giúp cả 5 thành viên đều tham gia đủ cả **Frontend và Backend**, đồng thời giảm trùng lặp công việc. Đây cũng là cách chia phù hợp nhất với nghiệp vụ **Đăng ký đề tài nghiên cứu**, vì nghiệp vụ này có thể tách thành các bước nhỏ nhưng vẫn liên kết chặt chẽ với nhau trong một luồng hoàn chỉnh.

Khi viết báo cáo hoặc trình bày demo, nhóm có thể mô tả theo đúng thứ tự các phần đã chia để thể hiện rõ sự đóng góp của từng thành viên và sự liên kết của toàn bộ hệ thống.
