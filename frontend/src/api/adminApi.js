import api from './axiosInstance';

export function getDashboardStats() {
  return api.get('/admin/dashboard');
}

export function createUser(data) {
  return api.post('/admin/users', data);
}

export function listUsers(params) {
  return api.get('/admin/users', { params });
}

export function getUserDetail(id) {
  return api.get(`/admin/users/${id}`);
}

export function listStoresAdmin(params) {
  return api.get('/admin/stores', { params });
}

export function createStore(data) {
  return api.post('/admin/stores', data);
}
