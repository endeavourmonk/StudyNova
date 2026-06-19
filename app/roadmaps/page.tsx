import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Route } from "lucide-react";

import { Navbar } from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
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
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/db/queries/get-current-user";
import { fetchRoadmapsMany } from "@/db/queries/roadmaps";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function RoadmapsPage() {
  const dbUser = await getCurrentUser();

  if (!dbUser) {
    notFound();
  }

  const { data: roadmaps } = await fetchRoadmapsMany(dbUser.userId, {
    pageSize: 50,
  });

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Route className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Learning Roadmaps
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-generated learning paths to guide your study
                </p>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href="/roadmaps/new">
              <Plus />
              New Roadmap
            </Link>
          </Button>
        </div>

        {roadmaps.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader className="items-center text-center py-12">
              <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-muted">
                <Route className="size-7 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">No roadmaps yet</CardTitle>
              <CardDescription className="max-w-sm">
                Generate your first learning roadmap by entering a topic — AI
                will create an ordered learning path for you.
              </CardDescription>
              <Button className="mt-4" asChild>
                <Link href="/roadmaps/new">
                  <Plus />
                  Generate roadmap
                </Link>
              </Button>
            </CardHeader>
          </Card>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead className="text-center">Steps</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roadmaps.map((roadmap) => (
                  <TableRow key={roadmap.roadmapId}>
                    <TableCell>
                      <Link
                        href={`/roadmaps/${roadmap.roadmapId}`}
                        className="font-medium hover:underline"
                      >
                        {roadmap.topic}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {roadmap.stepsJson.length} steps
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {formatDate(roadmap.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/roadmaps/${roadmap.roadmapId}`}>
                          View →
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
