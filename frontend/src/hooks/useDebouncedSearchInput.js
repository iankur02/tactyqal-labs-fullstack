import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Keeps a local input value in sync with an "external" value (usually derived
 * from the URL) while debouncing upstream propagation.
 *
 * - The input updates *immediately* (responsive typing).
 * - After `delay` ms of no typing, `onDebouncedChange(debounced)` is called.
 * - If the external value is changed by something else (e.g. "Clear filters"),
 *   the input reflects it without echoing back to the URL.
 *
 * Callback is stored in a ref so an unstable parent callback never causes
 * spurious debounce fires.
 */
export function useDebouncedSearchInput(externalValue, onDebouncedChange, delay = 400) {
  const [input, setInput] = useState(externalValue);
  const debounced = useDebounce(input, delay);
  const callbackRef = useRef(onDebouncedChange);

  useEffect(() => {
    callbackRef.current = onDebouncedChange;
  }, [onDebouncedChange]);

  useEffect(() => {
    if (debounced !== externalValue) callbackRef.current(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  useEffect(() => {
    setInput(externalValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalValue]);

  return [input, setInput];
}