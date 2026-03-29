// Middleware xử lý async/await
// Giúp bắt lỗi trong các async function

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
