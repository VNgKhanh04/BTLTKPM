// Utility để format response chuẩn

class ResponseFormatter {
  static success(data, message = 'Thành công') {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message, errors = null) {
    const response = {
      success: false,
      message
    };

    if (errors) {
      response.errors = errors;
    }

    return response;
  }

  static paginated(data, pagination) {
    return {
      success: true,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages
      }
    };
  }
}

module.exports = ResponseFormatter;
