const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9999/api';

const SERVICE_PORTS = {
  '/auth': import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081/api',
  '/users': import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8082/api',
  '/complaints': import.meta.env.VITE_COMPLAINT_SERVICE_URL || 'http://localhost:8083/api',
  '/departments': import.meta.env.VITE_DEPT_SERVICE_URL || 'http://localhost:8084/api',
  '/admins': import.meta.env.VITE_DEPT_SERVICE_URL || 'http://localhost:8084/api',
  '/images': import.meta.env.VITE_IMAGE_SERVICE_URL || 'http://localhost:8087/api',
};

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('mcp_jwt');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const smartFetch = async (path, options = {}) => {
  let targetBase = null;
  for (const [prefix, base] of Object.entries(SERVICE_PORTS)) {
    if (path.startsWith(prefix) && base && !base.includes('localhost')) {
      targetBase = base;
      break;
    }
  }

  const primaryUrl = targetBase ? `${targetBase}${path}` : `${BASE_URL}${path}`;
  try {
    const res = await fetch(primaryUrl, options);
    if (res.status !== 500 && res.status !== 503) {
      return res;
    }
    return res;
  } catch (e) {
    // Retry fallback if primary failed
    for (const [prefix, base] of Object.entries(SERVICE_PORTS)) {
      if (path.startsWith(prefix) && base !== targetBase) {
        try {
          return await fetch(`${base}${path}`, options);
        } catch (err) {
          // ignore
        }
      }
    }
    return await fetch(primaryUrl, options);
  }
};

const handleResponse = async (res) => {
  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}: ${res.statusText}`;
    try {
      const data = await res.json();
      if (data && (data.message || data.error)) {
        errorMsg = data.message || data.error;
      }
    } catch (e) {
      // Ignore JSON parse error if body is empty or non-JSON
    }
    throw new Error(errorMsg);
  }
  if (res.status === 240 || res.status === 204) {
    return null;
  }
  return await res.json();
};

export const authApi = {
  login: async (email, password) => {
    const res = await smartFetch('/auth/login', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },
  signup: async (name, email, phone, password) => {
    const res = await smartFetch('/auth/signup', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ name, email, phone, password }),
    });
    return handleResponse(res);
  },
  sendOtp: async (email) => {
    const res = await smartFetch('/auth/send-otp', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },
  sendForgotPasswordOtp: async (email) => {
    const res = await smartFetch('/auth/forgot-password/send-otp', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },
  verifyOtp: async (email, otp) => {
    const res = await smartFetch('/auth/verify-otp', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ email, otp }),
    });
    return handleResponse(res);
  },
  createAdmin: async (username, email, password, role) => {
    const res = await smartFetch('/auth/create-admin', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ username, email, password, role }),
    });
    return handleResponse(res);
  },
  updateProfile: async (userId, data) => {
    const res = await smartFetch(`/auth/profile/${userId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  resetPassword: async (email, newPassword) => {
    const res = await smartFetch('/auth/reset-password', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ email, newPassword }),
    });
    return handleResponse(res);
  },
  changePassword: async (email, oldPassword, newPassword) => {
    const res = await smartFetch('/auth/change-password', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ email, oldPassword, newPassword }),
    });
    return handleResponse(res);
  },
};

export const complaintsApi = {
  getAll: async () => {
    const res = await smartFetch('/complaints', {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  getActive: async () => {
    const res = await smartFetch('/complaints/active', {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  getById: async (id) => {
    const res = await smartFetch(`/complaints/${id}`, {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  create: async (complaintData) => {
    const res = await smartFetch('/complaints', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(complaintData),
    });
    return handleResponse(res);
  },
  toggleUpvote: async (id, userId) => {
    const res = await smartFetch(`/complaints/${id}/upvote?userId=${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  toggleRepost: async (id, userId) => {
    const res = await smartFetch(`/complaints/${id}/repost?userId=${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  report: async (id, reason, userId) => {
    const res = await smartFetch(`/complaints/${id}/report?userId=${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ reason }),
    });
    return handleResponse(res);
  },
  cycleStatus: async (id) => {
    const res = await smartFetch(`/complaints/${id}/cycle-status`, {
      method: 'PUT',
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  delete: async (id) => {
    const res = await smartFetch(`/complaints/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  addFeedback: async (id, rating, comment) => {
    const res = await smartFetch(`/complaints/${id}/feedback`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ rating, comment }),
    });
    return handleResponse(res);
  },
  track: async (token) => {
    const res = await smartFetch(`/complaints/track/${token}`, {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  officerStartAction: async (trackingToken, notes) => {
    const res = await smartFetch('/complaints/officer/start-action', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ trackingToken, notes }),
    });
    return handleResponse(res);
  },
  officerComplete: async (trackingToken, proofImageId, notes) => {
    const res = await smartFetch('/complaints/officer/complete', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ trackingToken, proofImageId, notes }),
    });
    return handleResponse(res);
  },
  getStats: async () => {
    const res = await smartFetch('/complaints/stats', {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  checkDuplicate: async (payload) => {
    const res = await smartFetch('/complaints/check-duplicate', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
  getAiAnalytics: async () => {
    const res = await smartFetch('/complaints/analytics/ai-duplicate-stats', {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
};

export const usersApi = {
  getAll: async () => {
    const res = await smartFetch('/users', {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  getById: async (id) => {
    const res = await smartFetch(`/users/${id}`, {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  update: async (id, userData) => {
    const res = await smartFetch(`/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },
  toggleBlock: async (id) => {
    const res = await smartFetch(`/users/${id}/block`, {
      method: 'PUT',
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  deleteUser: async (id) => {
    const res = await smartFetch(`/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
};

export const deptAdminApi = {
  getDepartments: async () => {
    const res = await smartFetch('/departments', {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  // createDepartment: async (deptData) => {
  //   const res = await smartFetch('/departments', {
  //     method: 'POST',
  //     headers: getHeaders(true),
  //     body: JSON.stringify(deptData),
  //   });
  //   return handleResponse(res);
  // },
createDepartment: async (deptData) => {
  const res = await smartFetch('/departments', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(deptData),
  });

  return handleResponse(res);
},

  updateDepartment: async (id, deptData) => {
    const res = await smartFetch(`/departments/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(deptData),
    });
    return handleResponse(res);
  },
  deleteDepartment: async (id) => {
    const res = await smartFetch(`/departments/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  getAdmins: async () => {
    const res = await smartFetch('/admins', {
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
  createAdmin: async (adminData) => {
    const res = await smartFetch('/admins', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(adminData),
    });
    const result = await handleResponse(res);

    try {
      await smartFetch('/auth/create-admin', {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({
          username: adminData.username || adminData.email.split('@')[0],
          email: adminData.email,
          password: adminData.password || 'ksjaisurya',
          role: adminData.role || 'SUPER_ADMIN',
        }),
      });
    } catch (e) {
      console.warn('Auth admin creation sync warning:', e);
    }

    return result;
  },
  updateAdmin: async (id, adminData) => {
    const res = await smartFetch(`/admins/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(adminData),
    });
    return handleResponse(res);
  },
  deleteAdmin: async (id, requesterEmail) => {
    const query = requesterEmail ? `?requesterEmail=${encodeURIComponent(requesterEmail)}` : '';
    const res = await smartFetch(`/admins/${id}${query}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(res);
  },
};

export const imagesApi = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const headers = getHeaders(false);

    const res = await smartFetch('/images/upload', {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(res);
  },
  deleteImage: async (imageId) => {
    if (!imageId || imageId.startsWith('http') || imageId.startsWith('data:')) return { success: true };
    try {
      const headers = getHeaders(false);
      const res = await smartFetch(`/images/${imageId}`, {
        method: 'DELETE',
        headers,
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn('Delete image error:', err);
      return { success: false };
    }
  },
  getImageUrl: (imageId) => {
    if (!imageId) return '';
    if (typeof imageId !== 'string') return '';
    if (imageId.startsWith('http://') || imageId.startsWith('https://') || imageId.startsWith('data:') || imageId.startsWith('blob:') || imageId.startsWith('/')) {
      return imageId;
    }
    return `${BASE_URL}/images/${imageId}`;
  },
};

export const aiApi = {
  classify: async (description, images = []) => {
    const res = await smartFetch('/ai/classify', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ description, images }),
    });
    return handleResponse(res);
  },
  detectMismatch: async (description, images = []) => {
    const res = await smartFetch('/ai/detect-mismatch', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ description, images }),
    });
    return handleResponse(res);
  },
};
