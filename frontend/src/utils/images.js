import { API_ORIGIN } from '@/api/client';

/** Turn a possibly-relative image URL (from /uploads) into an absolute one. */
export function resolveImageUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}