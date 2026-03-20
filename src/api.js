
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://adminpanel-server-hzzo.onrender.com/' 
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001' ;

const api = axios.create({
  baseURL: `${BASE_URL.replace(/\/$/, '')}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' } 
})

// ===================== REQUEST INTERCEPTOR =====================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ===================== RESPONSE INTERCEPTOR =====================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ===================== FILE UPLOAD HELPER =====================
export const uploadFile = async (file, folder = 'avatars') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

// ===================== ADMIN API =====================
export const adminApi = {
  // User Management
  getUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getUserBuildings: (id, params) => api.get(`/admin/users/${id}/buildings`, { params }),

  // Lead Management
  assignLeads: (data) => api.post('/admin/assign-leads', data),
  updateLeadPermission: (data) => api.put('/admin/update-permission', data),

  // ================= BUILDING ASSIGNMENT =================
  assignUsersToBuilding: (leadId, assignments) =>
    api.post(`/buildings/${leadId}/assign`, { assignments }),

  // Fetch a single building
  getBuilding: (leadId) => api.get(`/buildings/${leadId}`)
}

// ===================== EXPORT DEFAULT =====================
export default api;