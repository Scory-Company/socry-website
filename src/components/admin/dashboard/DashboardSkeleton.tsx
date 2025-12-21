import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <>
      {/* Top Metrics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-border p-6 rounded-lg bg-card">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-24 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Middle Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Subscriptions Card Skeleton */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Trending Articles Card Skeleton */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Feedback Card Skeleton */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="mb-4 pb-4 border-b border-border">
            <div className="flex gap-4">
              <div>
                <Skeleton className="h-8 w-10 mb-1" />
                <Skeleton className="h-3 w-10" />
              </div>
              <div>
                <Skeleton className="h-8 w-10 mb-1" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-2 py-2">
                <Skeleton className="h-6 w-16 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Card Skeleton */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                <div className="flex-1">
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
