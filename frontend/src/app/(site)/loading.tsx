import { Skeleton } from "@/components/ui/skeleton";

/**
 * Streaming fallback for the public routes. Mirrors the real page's rhythm so
 * the swap doesn't shift layout — a skeleton that doesn't match is worse than
 * no skeleton at all.
 */
export default function Loading() {
  return (
    <div className="container-page pb-24 pt-40">
      <div className="max-w-2xl space-y-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-4/5" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>

      <span className="sr-only" role="status">
        Loading page content
      </span>
    </div>
  );
}
