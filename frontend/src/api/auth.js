import api from './client';

export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data; // { accessToken, user }
}

export async function refresh() {
  const { data } = await api.post('/auth/refresh');
  return data.data;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function me() {
  const { data } = await api.get('/auth/me');
  return data.data.user;
}