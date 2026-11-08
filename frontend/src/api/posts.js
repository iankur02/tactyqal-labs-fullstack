import api from './client';

export async function fetchPosts(params = {}) {
  const { data } = await api.get('/posts', { params });
  return { data: data.data, meta: data.meta };
}

export async function fetchPostBySlug(slug) {
  const { data } = await api.get(`/posts/slug/${slug}`);
  return data.data;
}

export const postsQueryKey = (params) => ['posts', params];
export const postQueryKey = (slug) => ['post', slug];