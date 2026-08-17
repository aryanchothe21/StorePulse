import api from './axiosInstance';

export function browseStores(params) {
  return api.get('/stores', { params });
}
