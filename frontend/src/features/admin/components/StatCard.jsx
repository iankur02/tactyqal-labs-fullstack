const tones = {
  blue: 'bg-brand-500/10 text-brand-600',
  emerald: 'bg-emerald-500/10 text-emerald-600',
  amber: 'bg-amber-500/10 text-amber-600',
  purple: 'bg-violet-500/10 text-violet-600',
};

export default function StatCard({ label, value, icon: Icon, tone = 'blue', loading }) {
  return (
    <div className="rounded-xl2 border border-brand-950/10 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-950/50">
          {label}
        </span>
        {Icon ? (
          <span className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone]}`}>
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      <div className="mt-3 text-3xl font-display text-brand-950">
        {loading ? <span className="inline-block h-8 w-16 animate-pulse rounded bg-surface-200" /> : value}
      </div>
    </div>
  );
}