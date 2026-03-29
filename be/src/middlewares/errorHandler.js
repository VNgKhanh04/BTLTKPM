// Middleware xử lý lỗi tập trung
// Thành viên 5: Kiểm tra điều kiện đăng ký, thông báo và xử lý lỗi

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Lỗi validation từ Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'Dữ liệu đã tồn tại',
      field: err.meta?.target?.[0] || 'unknown',
      message: 'Giá trị này đã được sử dụng'
    });
  }

  // Lỗi không tìm thấy record
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Không tìm thấy dữ liệu',
      message: err.message
    });
  }

  // Lỗi foreign key constraint
  if (err.code === 'P2003') {
    return res.status(400).json({
      error: 'Dữ liệu liên quan không tồn tại',
      field: err.meta?.field_name || 'unknown',
      message: 'Vui lòng kiểm tra lại dữ liệu liên quan'
    });
  }

  // Lỗi validation tùy chỉnh
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Lỗi validation',
      message: err.message,
      details: err.details || []
    });
  }

  // Lỗi không có quyền
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Không có quyền truy cập',
      message: err.message
    });
  }

  // Lỗi mặc định
  res.status(err.status || 500).json({
    error: 'Lỗi hệ thống',
    message: err.message || 'Đã xảy ra lỗi không xác định',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
