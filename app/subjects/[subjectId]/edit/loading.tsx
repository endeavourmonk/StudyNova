import { Navbar } from "@/app/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function EditSubjectLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Skeleton className="mb-6 h-8 w-28" />

        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
          <CardFooter className="py-4">
            <Skeleton className="h-10 w-28 rounded-md" />
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
