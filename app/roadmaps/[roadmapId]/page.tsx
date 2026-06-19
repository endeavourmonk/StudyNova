import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Route } from "lucide-react";

import { Navbar } from "@/app/components/Navbar";
import { DeleteRoadmapButton } from "../delete-roadmap-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/db/queries/get-current-user";
import { fetchRoadmapById } from "@/db/queries/roadmaps";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

type RoadmapDetailPageProps = {
  params: Promise<{ roadmapId: string }>;
};

export default async function RoadmapDetailPage({
  params,
}: RoadmapDetailPageProps) {
  const { roadmapId } = await params;
  const dbUser = await getCurrentUser();

  if (!dbUser) {
    notFound();
  }

  const roadmap = await fetchRoadmapById(roadmapId, dbUser.userId);

  if (!roadmap) {
    notFound();
  }

  const steps = roadmap.stepsJson;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href="/roadmaps">
            <ChevronLeft />
            Roadmaps
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Route className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {roadmap.topic}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{steps.length} steps</Badge>
                <span>·</span>
                <span>Created {formatDate(roadmap.createdAt)}</span>
              </div>
            </div>
          </div>
          <DeleteRoadmapButton
            roadmapId={roadmap.roadmapId}
            topic={roadmap.topic}
          />
        </div>

        {/* Timeline / Steps */}
        <div className="relative space-y-0">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            return (
              <div key={step.order} className="relative flex gap-4 pb-8">
                {/* Vertical line */}
                {!isLast && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border" />
                )}

                {/* Step number circle */}
                <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary shadow-sm">
                  {step.order}
                </div>

                {/* Step content */}
                <Card className="flex-1 transition-colors hover:border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {/* Finish marker */}
          <div className="relative flex gap-4">
            <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-lg dark:bg-emerald-950/30">
              🎯
            </div>
            <div className="flex items-center">
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                You&apos;re ready! Start building real projects.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
