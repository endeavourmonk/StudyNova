import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeft } from "lucide-react";

import { Navbar } from "@/app/components/Navbar";
import { SubjectForm } from "@/app/subjects/subject-form";
import { Button } from "@/components/ui/button";
import { fetchUserByClerkId } from "@/db/queries/users";

export default async function NewSubjectPage() {
  const { userId: clerkUserId } = await auth.protect();
  const dbUser = await fetchUserByClerkId(clerkUserId);

  if (!dbUser) {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-16">
          <p className="text-center text-muted-foreground">
            Your account is still being set up. Please try again in a moment.
          </p>
          <Button variant="outline" asChild>
            <Link href="/app">Back to dashboard</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href="/app">
            <ChevronLeft />
            Dashboard
          </Link>
        </Button>
        <SubjectForm mode="create" />
      </main>
    </div>
  );
}
