'use client';

interface SidebarSkeletonProps {
  rows?: number;
}

export function SidebarSkeleton({ rows = 4 }: SidebarSkeletonProps) {
  return (
    <ul className="space-y-2 px-2" aria-hidden>
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="hyphai-skeleton h-10 rounded-xl" />
      ))}
    </ul>
  );
}
