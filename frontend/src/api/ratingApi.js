import api from './axiosInstance';

export function submitRating(storeId, value) {
  return api.post('/ratings', { storeId, value });
}
