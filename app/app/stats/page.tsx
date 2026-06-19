import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ClipboardCheck,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";

import { Navbar } from "@/app/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/db/queries/get-current-user";
import {
  fetchOverallStats,
  fetchRecentAttempts,
  fetchSubjectStats,
} from "@/db/queries/quiz-attempts";

function formatDateShort(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getScoreColor(pct: number) {
  if (pct >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (pct >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getScoreBadgeVariant(pct: number): "default" | "secondary" | "destructive" | "outline" {
  if (pct >= 80) return "default";
  if (pct >= 50) return "secondary";
  return "destructive";
}

// ─── Stat Cards ───────────────────────────────────────────────────────────

async function StatsOverview({ userId }: { userId: string }) {
  const stats = await fetchOverallStats(userId);

  const cards = [
    {
      title: "Total Attempts",
      value: stats.totalAttempts,
      icon: ClipboardCheck,
      description: "Quiz submissions",
      accent: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Average Score",
      value: `${stats.avgPercentage}%`,
      icon: TrendingUp,
      description: "Across all quizzes",
      accent: getScoreColor(stats.avgPercentage),
      bg:
        stats.avgPercentage >= 80
          ? "bg-emerald-50 dark:bg-emerald-950/30"
          : stats.avgPercentage >= 50
            ? "bg-amber-50 dark:bg-amber-950/30"
            : "bg-red-50 dark:bg-red-950/30",
    },
    {
      title: "Best Score",
      value: `${stats.bestPercentage}%`,
      icon: Trophy,
      description: "Personal best",
      accent: getScoreColor(stats.bestPercentage),
      bg:
        stats.bestPercentage >= 80
          ? "bg-emerald-50 dark:bg-emerald-950/30"
          : stats.bestPercentage >= 50
            ? "bg-amber-50 dark:bg-amber-950/30"
            : "bg-red-50 dark:bg-red-950/30",
    },
    {
      title: "Quizzes Taken",
      value: stats.uniqueQuizzes,
      icon: Target,
      description: "Unique quizzes",
      accent: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
  ];

  if (stats.totalAttempts === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="items-center text-center py-12">
          <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-muted">
            <BarChart3 className="size-7 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">No quiz attempts yet</CardTitle>
          <CardDescription className="max-w-sm">
            Take your first quiz to start tracking your learning progress. Stats
            will appear here after you complete a quiz.
          </CardDescription>
          <Button className="mt-4" asChild>
            <Link href="/app">Go to Dashboard</Link>
          </Button>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              {card.title}
            </CardDescription>
            <div
              className={`flex size-9 items-center justify-center rounded-lg ${card.bg}`}
            >
              <card.icon className={`size-4 ${card.accent}`} />
            </div>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold tabular-nums ${card.accent}`}>
              {card.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatsOverviewSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-9 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Recent Attempts Table ────────────────────────────────────────────────

async function RecentAttempts({ userId }: { userId: string }) {
  const attempts = await fetchRecentAttempts(userId, 10);

  if (attempts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Attempts</CardTitle>
        <CardDescription>Your last 10 quiz submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Note</TableHead>
                <TableHead className="hidden sm:table-cell">Subject</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="hidden md:table-cell text-right">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attempts.map((attempt) => {
                const pct = Math.round(
                  (attempt.score / attempt.totalQuestions) * 100,
                );
                return (
                  <TableRow key={attempt.attemptId}>
                    <TableCell>
                      <Link
                        href={`/subjects/${attempt.subjectId}/notes/${attempt.noteId}/quiz/${attempt.quizId}`}
                        className="font-medium hover:underline"
                      >
                        {attempt.noteTitle}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {attempt.subjectName}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className={`font-bold tabular-nums ${getScoreColor(pct)}`}
                        >
                          {attempt.score}/{attempt.totalQuestions}
                        </span>
                        <Badge
                          variant={getScoreBadgeVariant(pct)}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {pct}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-right text-muted-foreground md:table-cell">
                      {formatDateShort(attempt.completedAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentAttemptsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-52" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20 hidden md:block" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Subject Breakdown ────────────────────────────────────────────────────

async function SubjectBreakdown({ userId }: { userId: string }) {
  const subjectStats = await fetchSubjectStats(userId);

  if (subjectStats.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance by Subject</CardTitle>
        <CardDescription>
          Quiz performance breakdown across your subjects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjectStats.map((subject) => {
            const avgPct = Math.round(Number(subject.avgPercentage ?? 0));
            return (
              <div key={subject.subjectId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {subject.subjectName}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {subject.attempts}{" "}
                      {subject.attempts === 1 ? "attempt" : "attempts"}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums ${getScoreColor(avgPct)}`}
                  >
                    {avgPct}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      avgPct >= 80
                        ? "bg-emerald-500"
                        : avgPct >= 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(avgPct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function SubjectBreakdownSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function StatsPage() {
  const dbUser = await getCurrentUser();

  if (!dbUser) {
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

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Quiz Stats
              </h1>
              <p className="text-sm text-muted-foreground">
                Track your learning progress across all subjects
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Summary cards */}
          <Suspense fallback={<StatsOverviewSkeleton />}>
            <StatsOverview userId={dbUser.userId} />
          </Suspense>

          {/* Two-column layout for table + subject breakdown */}
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Suspense fallback={<RecentAttemptsSkeleton />}>
                <RecentAttempts userId={dbUser.userId} />
              </Suspense>
            </div>
            <div className="lg:col-span-2">
              <Suspense fallback={<SubjectBreakdownSkeleton />}>
                <SubjectBreakdown userId={dbUser.userId} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
