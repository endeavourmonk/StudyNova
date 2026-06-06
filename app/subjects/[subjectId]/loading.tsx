import { Navbar } from "@/app/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectDetailLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Skeleton className="mb-6 h-8 w-24" />

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>

        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>

          <div className="rounded-lg border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b px-4 py-3 last:border-0"
              >
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32 hidden sm:block" />
                <Skeleton className="h-4 w-32 hidden md:block" />
                <Skeleton className="h-8 w-12" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
