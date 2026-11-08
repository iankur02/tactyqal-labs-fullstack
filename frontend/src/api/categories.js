import api from './client';

export async function fetchCategories() {
  const { data } = await api.get('/categories');
  return data.data;
}

export const categoriesQueryKey = ['categories'];