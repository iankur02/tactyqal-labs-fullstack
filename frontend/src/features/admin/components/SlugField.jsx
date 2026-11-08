import { useEffect, useRef } from 'react';
import { baseSlug } from '@/utils/slug';

export default function SlugField({ title, value, onChange, autoSlug = true, error }) {
  const manualRef = useRef(!autoSlug);

  useEffect(() => {
    if (manualRef.current || !autoSlug) return;
    const generated = baseSlug(title || '');
    if (generated !== value) onChange(generated);
  }, [title, value, onChange, autoSlug]);

  return (
    <div>
      <label
        htmlFor="post-slug"
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-950/60"
      >
        Slug
      </label>
      <div className="flex items-stretch overflow-hidden rounded-xl border border-brand-950/15 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
        <span className="flex items-center bg-surface-50 px-3 text-xs text-brand-950/50">/blog/</span>
        <input
          id="post-slug"
          value={value}
          onChange={(e) => {
            manualRef.current = true;
            onChange(e.target.value);
          }}
          placeholder="url-friendly-slug"
          className="flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-brand-950 outline-none placeholder:text-brand-950/30"
        />
      </div>
      {error ? <p className="mt-1.5 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}