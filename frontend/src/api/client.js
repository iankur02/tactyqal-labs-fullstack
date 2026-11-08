import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';
export const API_ORIGIN = baseURL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15_000,
});

let getAccessToken = () => null;
export function setAccessTokenGetter(fn) {
  getAccessToken = fn;
}

let onAuthRefreshed = () => {};
let onAuthFailure = () => {};
export function setAuthCallbacks({ onRefreshed, onFailure }) {
  onAuthRefreshed = onRefreshed || (() => {});
  onAuthFailure = onFailure || (() => {});
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let refreshQueue = [];

const isAuthUrl = (url = '') => url.includes('/auth/');

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status ?? 0;
    const original = error.config || {};
    const canAttemptRefresh = status === 401 && !original._retry && !isAuthUrl(original.url);

    if (canAttemptRefresh) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject, original });
        })
          .then((newToken) => {
            original.headers = {
              ...(original.headers || {}),
              Authorization: `Bearer ${newToken}`,
            };
            return api(original);
          })
          .catch(() => Promise.reject(normalizeError(error)));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        const newToken = data?.data?.accessToken;
        if (!newToken) throw new Error('No token returned');

        onAuthRefreshed(newToken);
        refreshQueue.forEach(({ resolve }) => resolve(newToken));
        refreshQueue = [];

        original.headers = {
          ...(original.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };
        return api(original);
      } catch (refreshErr) {
        refreshQueue.forEach(({ reject }) => reject(normalizeError(refreshErr)));
        refreshQueue = [];
        onAuthFailure();
        return Promise.reject(normalizeError(error));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

function normalizeError(error) {
  const status = error.response?.status ?? 0;
  const message =
    error.response?.data?.message ||
    (status === 0 ? 'Network error — is the API running?' : 'Something went wrong');
  return { message, status, details: error.response?.data?.errors };
}

export default api;