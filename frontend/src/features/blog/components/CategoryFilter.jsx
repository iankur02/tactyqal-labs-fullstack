export default function CategoryFilter({ categories, value, onChange }) {
  const all = [{ _id: 'all', name: 'All', slug: '' }, ...categories];

  return (
    <div
      role="tablist"
      aria-label="Filter by category"
      className="flex flex-wrap gap-2"
    >
      {all.map((cat) => {
        const active = (value || '') === (cat.slug || '');
        return (
          <button
            key={cat._id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(cat.slug || '')}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              active
                ? 'border-brand-500 bg-brand-500 text-white shadow-soft'
                : 'border-brand-950/15 bg-white text-brand-950/70 hover:border-brand-950/30 hover:text-brand-950'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}