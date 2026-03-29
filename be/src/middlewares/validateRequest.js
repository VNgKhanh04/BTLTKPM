// Middleware validate request
// Thành viên 5: Kiểm tra điều kiện đăng ký, thông báo và xử lý lỗi

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Dữ liệu không hợp lệ',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};

module.exports = validateRequest;
