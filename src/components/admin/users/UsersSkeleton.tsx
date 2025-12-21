import { Skeleton } from "@/components/ui/skeleton";

export function UsersSkeleton() {
  return (
    <>
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-border p-6 rounded-lg bg-card">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-16" />
          </div>
        ))}
      </div>

      {/* Search & Filter Skeleton */}
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {[...Array(6)].map((_, i) => (
                  <th key={i} className="text-left py-3 px-4">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 px-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="py-3 px-4">
                    <Skeleton className="h-4 w-40" />
                  </td>
                  <td className="py-3 px-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="py-3 px-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="py-3 px-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="py-3 px-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
