import { format } from 'date-fns';

export function formatDate(input, pattern = 'MMM d, yyyy') {
  if (!input) return '';
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, pattern);
}