'use client';

interface MessageListSkeletonProps {
  count?: number;
}

export function MessageListSkeleton({ count = 3 }: MessageListSkeletonProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`hyphai-skeleton rounded-2xl ${
              i % 2 === 0 ? 'h-16 w-[70%]' : 'h-10 w-[45%]'
            }`}
          />
        </div>
      ))}
    </div>
  );
}
