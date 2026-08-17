import api from './axiosInstance';



export function signup(data) {
  return api.post('/auth/signup', data);
}

export function login(data) {
  return api.post('/auth/login', data);
}

export function updatePassword(data) {
  return api.patch('/auth/update-password', data);
}
