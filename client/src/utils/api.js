const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getClerkToken = async () => {
  return new Promise((resolve) => {
    const checkClerk = () => {
      if (window.Clerk && window.Clerk.session) {
        window.Clerk.session.getToken().then(resolve).catch(() => resolve(null));
      } else {
        setTimeout(checkClerk, 100);
      }
    };
    checkClerk();
  });
};

const apiRequest = async (endpoint, options = {}) => {
  const token = await getClerkToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const headers = { ...options.headers };
  headers['Authorization'] = `Bearer ${token}`;

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    console.error(`API Error [${endpoint}]:`, response.status, errorData);
    throw new Error(errorData.error || 'Request failed');
  }

  return response.json();
};

export const getProfile = () => apiRequest('/api/profiles/me');

export const saveProfile = (data) =>
  apiRequest('/api/profiles', { method: 'POST', body: JSON.stringify(data) });

export const getMines = () => apiRequest('/api/mines');

export const createMine = (data) =>
  apiRequest('/api/mines', { method: 'POST', body: JSON.stringify(data) });

export const deleteMine = (id) =>
  apiRequest(`/api/mines/${id}`, { method: 'DELETE' });

export const analyzeDocument = (mineId, mineName, pdfFile) => {
  const formData = new FormData();
  formData.append('pdf', pdfFile);
  formData.append('mineName', mineName);
  return apiRequest(`/api/analysis/${mineId}`, { method: 'POST', body: formData });
};

export const saveDashboardData = (mineId, dashboardData, insightsData) =>
  apiRequest(`/api/analysis/${mineId}/dashboard`, {
    method: 'POST',
    body: JSON.stringify({ dashboardData, insightsData }),
  });

export const getDownloadUrl = (mineId) =>
  apiRequest(`/api/storage/download/${mineId}`);