// API Service - Cấu hình fetch và các hàm gọi API
// Thành viên 1: Màn hình danh sách đề tài và tìm kiếm

const DEFAULT_API_BASE_URL = 'http://localhost:3000/api';

export const REGISTRATION_TYPES = {
  EXISTING_TOPIC: 'DE_TAI_CO_SAN',
  PROPOSED_TOPIC: 'DE_XUAT_MOI',
};

export const API_BASE_URL = (
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

const isDefinedValue = (value) => value !== undefined && value !== null && value !== '';

export const getRegistrationType = (source) => (
  source?.loai_dang_ky ||
  source?.loaiDangKy ||
  REGISTRATION_TYPES.EXISTING_TOPIC
);

export const isProposalRegistration = (source) => (
  getRegistrationType(source) === REGISTRATION_TYPES.PROPOSED_TOPIC
);

export const getRegistrationTypeLabel = (source) => (
  isProposalRegistration(source) ? 'Đề xuất đề tài mới' : 'Đề tài có sẵn'
);

export const getRegistrationTopic = (registration) => (
  registration?.DeTaiNghienCuu ||
  registration?.NhomNghienCuu?.DeTaiNghienCuu ||
  null
);

export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (isDefinedValue(value)) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const getApiUrl = (endpoint) => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return text ? { message: text } : null;
  }

  return response.json();
};

// Helper function để gọi API
export const fetchAPI = async (endpoint, options = {}) => {
  const { headers, ...restOptions } = options;

  try {
    const response = await fetch(getApiUrl(endpoint), {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...restOptions,
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
      throw new Error(data?.error || data?.message || 'Có lỗi xảy ra');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API cho đề tài
export const topicAPI = {
  // Lấy danh sách đề tài với phân trang và filter
  getList: (params = {}) => {
    return fetchAPI(`/topics${buildQueryString(params)}`);
  },

  // Lấy chi tiết đề tài
  getById: (id) => {
    return fetchAPI(`/topics/${id}`);
  },

  // Kiểm tra khả năng đăng ký
  checkAvailability: (id) => {
    return fetchAPI(`/topics/${id}/availability`);
  },
};

// API cho lĩnh vực
export const fieldAPI = {
  // Lấy danh sách lĩnh vực
  getList: () => {
    return fetchAPI('/fields');
  },

  // Lấy chi tiết lĩnh vực
  getById: (id) => {
    return fetchAPI(`/fields/${id}`);
  },
};

// API cho nhóm nghiên cứu (Thành viên 2)
export const groupAPI = {
  // Tạo nhóm nghiên cứu
  create: (groupData) => {
    return fetchAPI('/research-groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  },

  // Lấy chi tiết nhóm
  getById: (id) => {
    return fetchAPI(`/research-groups/${id}`);
  },

  // Thêm thành viên vào nhóm
  addMember: (groupId, studentId, role = 'THANH_VIEN') => {
    return fetchAPI(`/research-groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ sinhVienId: studentId, vaiTro: role }),
    });
  },

  // Xóa thành viên khỏi nhóm
  removeMember: (groupId, studentId) => {
    return fetchAPI(`/research-groups/${groupId}/members/${studentId}`, {
      method: 'DELETE',
    });
  },

  // Lấy danh sách thành viên
  getMembers: (groupId) => {
    return fetchAPI(`/research-groups/${groupId}/members`);
  },
};

// API cho sinh viên (Thành viên 2)
export const studentAPI = {
  // Tìm kiếm sinh viên
  search: (keyword) => {
    return fetchAPI(`/students/search${buildQueryString({ keyword })}`);
  },

  // Lấy thông tin sinh viên
  getById: (id) => {
    return fetchAPI(`/students/${id}`);
  },

  // Kiểm tra điều kiện tham gia nhóm
  checkEligibility: (id) => {
    return fetchAPI(`/students/${id}/eligibility`);
  },
};

// API cho giảng viên (Thành viên 3)
export const lecturerAPI = {
  // Lấy danh sách giảng viên
  getList: (params = {}) => {
    return fetchAPI(`/lecturers${buildQueryString(params)}`);
  },

  // Lấy chi tiết giảng viên
  getById: (id) => {
    return fetchAPI(`/lecturers/${id}`);
  },

  // Kiểm tra quota hướng dẫn
  checkQuota: (id) => {
    return fetchAPI(`/lecturers/${id}/quota`);
  },

  // Gán giảng viên hướng dẫn cho nhóm
  assignToGroup: (groupId, lecturerId) => {
    return fetchAPI(`/research-groups/${groupId}/advisor`, {
      method: 'PUT',
      body: JSON.stringify({ giangVienId: lecturerId }),
    });
  },
};

// API cho hồ sơ đăng ký (Thành viên 4)
export const registrationAPI = {
  // Tạo hồ sơ đăng ký
  create: (registrationData) => {
    return fetchAPI('/topic-registrations', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  // Lấy chi tiết hồ sơ
  getById: (id) => {
    return fetchAPI(`/topic-registrations/${id}`);
  },

  // Lấy danh sách hồ sơ
  getList: (params = {}) => {
    return fetchAPI(`/topic-registrations${buildQueryString(params)}`);
  },

  // Cập nhật hồ sơ
  update: (id, updateData) => {
    return fetchAPI(`/topic-registrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Xác nhận nộp hồ sơ
  submit: (id) => {
    return fetchAPI(`/topic-registrations/${id}/submit`, {
      method: 'PATCH',
    });
  },

  // Lấy timeline
  getTimeline: (id) => {
    return fetchAPI(`/topic-registrations/${id}/timeline`);
  },
};

// API cho thông báo (Thành viên 5)
export const notificationAPI = {
  // Lấy danh sách thông báo
  getList: (params = {}) => {
    return fetchAPI(`/notifications${buildQueryString(params)}`);
  },

  // Tạo thông báo
  create: (notificationData) => {
    return fetchAPI('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },

  // Đánh dấu đã đọc
  markAsRead: (id) => {
    return fetchAPI(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  // Đếm số thông báo chưa đọc
  getUnreadCount: (nguoiNhanId, loaiNguoiNhan) => {
    return fetchAPI(
      `/notifications/unread-count${buildQueryString({ nguoiNhanId, loaiNguoiNhan })}`
    );
  },
};

// API cho validation (Thành viên 5)
export const validationAPI = {
  // Validate hồ sơ đăng ký
  validateRegistration: (registrationData) => {
    return fetchAPI('/validation/topic-registration', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  // Lấy danh sách lỗi
  getErrors: (registrationId) => {
    return fetchAPI(`/validation/registration/${registrationId}/errors`);
  },

  // Kiểm tra trùng đề tài
  checkDuplicate: (topicId, nhomId) => {
    return fetchAPI(`/validation/topic/${topicId}/check-duplicate`, {
      method: 'POST',
      body: JSON.stringify({ nhomId }),
    });
  },
};

const api = {
  topicAPI,
  fieldAPI,
  groupAPI,
  studentAPI,
  lecturerAPI,
  registrationAPI,
  notificationAPI,
  validationAPI,
};

export default api;
