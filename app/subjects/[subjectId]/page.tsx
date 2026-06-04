import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeft, Pencil } from "lucide-react";
import { notFound } from "next/navigation";

import { Navbar } from "@/app/components/Navbar";
import { DeleteSubjectButton } from "@/app/subjects/delete-subject-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchSubjectById } from "@/db/queries/subjects";
import { fetchUserByClerkId } from "@/db/queries/users";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

type SubjectDetailPageProps = {
  params: Promise<{ subjectId: string }>;
};

export default async function SubjectDetailPage({
  params,
}: SubjectDetailPageProps) {
  const { subjectId } = await params;
  const { userId: clerkUserId } = await auth.protect();
  const dbUser = await fetchUserByClerkId(clerkUserId);

  if (!dbUser) {
    notFound();
  }

  const subject = await fetchSubjectById(subjectId, dbUser.userId);
  if (!subject) {
    notFound();
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

        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{subject.name}</CardTitle>
            <CardDescription>Subject details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b py-2">
              <span className="text-muted-foreground">Created</span>
              <span>{formatDate(subject.createdAt)}</span>
            </div>
            <div className="flex justify-between gap-4 border-b py-2">
              <span className="text-muted-foreground">Last updated</span>
              <span>{formatDate(subject.updatedAt)}</span>
            </div>
          </CardContent>
          <div className="flex flex-wrap gap-2 border-t px-6 py-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/subjects/${subject.subjectId}/edit`}>
                <Pencil />
                Edit
              </Link>
            </Button>
            <DeleteSubjectButton
              subjectId={subject.subjectId}
              subjectName={subject.name}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}
