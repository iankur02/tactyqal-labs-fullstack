import api from './client';

export async function fetchAdminPosts(params) {
  const { data } = await api.get('/posts/admin', { params });
  return { data: data.data, meta: data.meta };
}

export async function fetchAdminPost(id) {
  const { data } = await api.get(`/posts/${id}`);
  return data.data;
}

export async function fetchStats() {
  const { data } = await api.get('/posts/stats');
  return data.data;
}

export async function createPost(payload) {
  const { data } = await api.post('/posts', payload);
  return data.data;
}

export async function updatePost(id, payload) {
  const { data } = await api.put(`/posts/${id}`, payload);
  return data.data;
}

export async function deletePost(id) {
  await api.delete(`/posts/${id}`);
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append('image', file);
  // Let axios/browser set the multipart boundary automatically.
  const { data } = await api.post('/upload', form);
  return data.data; // { url, publicId }
}

export const adminPostsQueryKey = (params) => ['adminPosts', params];
export const adminPostQueryKey = (id) => ['adminPost', id];
export const statsQueryKey = ['adminStats'];