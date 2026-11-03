export function StudioCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="skeleton h-48 w-full rounded-b-none" />
      <div className="card-body gap-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => <StudioCardSkeleton key={i} />)}
    </div>
  );
}

export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="skeleton h-16 w-full" />)}
    </div>
  );
}
