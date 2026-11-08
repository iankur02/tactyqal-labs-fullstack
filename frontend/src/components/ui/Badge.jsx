const tones = {
  published: 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20',
  draft: 'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20',
  neutral: 'bg-brand-950/5 text-brand-950/60 ring-1 ring-brand-950/10',
  danger: 'bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20',
};

export default function Badge({ tone = 'neutral', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${tones[tone] || tones.neutral}`}
    >
      {children}
    </span>
  );
}