import { Navbar } from "@/app/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function QuizLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <Skeleton className="mb-2 h-4 w-32" />
        <Skeleton className="mb-6 h-8 w-2/3" />

        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="mb-4">
            <CardHeader>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-10 w-full rounded-md" />
              ))}
            </CardContent>
          </Card>
        ))}

        <Skeleton className="mt-4 h-11 w-full rounded-md" />
      </main>
    </div>
  );
}
