export default function Skeleton({ className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-surface-200/80 ${className}`}
      {...rest}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-2/3' : i === 0 ? 'w-full' : 'w-5/6'}`}
        />
      ))}
    </div>
  );
}