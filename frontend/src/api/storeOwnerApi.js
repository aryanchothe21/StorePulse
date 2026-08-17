import api from './axiosInstance';

export function getStoreOwnerDashboard() {
  return api.get('/store-owner/dashboard');
}
