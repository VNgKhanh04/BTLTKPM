const DEFAULT_API_BASE_URL = 'http://localhost:3001/api';
const AUTH_TOKEN_KEY = 'nckh_auth_token';
const AUTH_USER_KEY = 'nckh_auth_user';

export const API_BASE_URL = (
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

export const storage = {
  getToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
  setToken: (token) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),
  getUser: () => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user) => localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(AUTH_USER_KEY),
  clearSession: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

const getApiUrl = (endpoint) => {
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

export const fetchAPI = async (endpoint, options = {}) => {
  const token = storage.getToken();
  const { headers, skipAuth, ...restOptions } = options;

  const response = await fetch(getApiUrl(endpoint), {
    headers: {
      'Content-Type': 'application/json',
      ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...restOptions,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Có lỗi xảy ra');
  }

  return data;
};

export const authAPI = {
  login: async (credentials) => {
    const result = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true,
    });

    storage.setToken(result.token);
    storage.setUser(result.user);
    return result;
  },

  getMe: async () => {
    const user = await fetchAPI('/auth/me');
    storage.setUser(user);
    return user;
  },

  logout: () => {
    storage.clearSession();
  },
};

export const topicAPI = {
  getList: (params = {}) => fetchAPI(`/topics${buildQueryString(params)}`),
};

export const lecturerAPI = {
  getList: (params = {}) => fetchAPI(`/lecturers${buildQueryString(params)}`),
};

export const fieldAPI = {
  getList: () => fetchAPI('/fields'),
};

export const councilAPI = {
  getList: () => fetchAPI('/science-councils'),
};

export const registrationAPI = {
  createAsStudent: (payload) =>
    fetchAPI('/topic-registrations/student', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMine: () => fetchAPI('/topic-registrations/my'),

  getAssignedToMe: () => fetchAPI('/topic-registrations/assigned-to-me'),

  review: (id, payload) =>
    fetchAPI(`/topic-registrations/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};

export const defenseScheduleAPI = {
  getEligibleTopics: (params = {}) =>
    fetchAPI(`/defense-schedules/eligible-topics${buildQueryString(params)}`),

  getList: (params = {}) =>
    fetchAPI(`/defense-schedules${buildQueryString(params)}`),

  createBulk: (payload) =>
    fetchAPI('/defense-schedules/bulk', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

const api = {
  authAPI,
  topicAPI,
  lecturerAPI,
  fieldAPI,
  councilAPI,
  registrationAPI,
  defenseScheduleAPI,
  storage,
};

export default api;
