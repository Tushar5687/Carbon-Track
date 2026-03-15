// WHY: Centralizes all API calls. Attaches Clerk JWT automatically.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiRequest = async (endpoint, options = {}) => {
  const token = await window.Clerk?.session?.getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};

export const getProfile = () => apiRequest('/api/profiles/me');
export const saveProfile = (data) => apiRequest('/api/profiles', { method: 'POST', body: JSON.stringify(data) });
export const getMines = () => apiRequest('/api/mines');
export const createMine = (data) => apiRequest('/api/mines', { method: 'POST', body: JSON.stringify(data) });
export const deleteMine = (id) => apiRequest(`/api/mines/${id}`, { method: 'DELETE' });

export const analyzeDocument = (mineId, mineName, pdfFile) => {
  const formData = new FormData();
  formData.append('pdf', pdfFile);
  formData.append('mineName', mineName);
  return apiRequest(`/api/analysis/${mineId}`, { method: 'POST', body: formData });
};

export const saveDashboardData = (mineId, dashboardData, insightsData) =>
  apiRequest(`/api/analysis/${mineId}/dashboard`, {
    method: 'POST', body: JSON.stringify({ dashboardData, insightsData })
  });

export const getDownloadUrl = (mineId) => apiRequest(`/api/storage/download/${mineId}`);