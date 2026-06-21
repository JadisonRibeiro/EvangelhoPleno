import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton de carregamento para páginas de listagem. */
export function ListSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <div className="h-11 bg-muted/50" />
        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="hidden h-4 w-28 sm:block" />
              <Skeleton className="hidden h-4 w-20 sm:block" />
              <Skeleton className="ml-auto h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
