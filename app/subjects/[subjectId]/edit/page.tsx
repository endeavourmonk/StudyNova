import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { Navbar } from "@/app/components/Navbar";
import { SubjectForm } from "@/app/subjects/subject-form";
import { Button } from "@/components/ui/button";
import { fetchSubjectById } from "@/db/queries/subjects";
import { getCurrentUser } from "@/db/queries/get-current-user";

type EditSubjectPageProps = {
  params: Promise<{ subjectId: string }>;
};

export default async function EditSubjectPage({ params }: EditSubjectPageProps) {
  const { subjectId } = await params;
  const dbUser = await getCurrentUser();

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
          <Link href={`/subjects/${subject.subjectId}`}>
            <ChevronLeft />
            {subject.name}
          </Link>
        </Button>
        <SubjectForm
          mode="edit"
          subjectId={subject.subjectId}
          initialName={subject.name}
        />
      </main>
    </div>
  );
}
