"use client";

import { useState, useTransition } from "react";
import { Loader2, Route, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateRoadmapAction } from "./actions";

export function RoadmapForm() {
  const [topic, setTopic] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || isPending) return;
    setError(null);

    startTransition(async () => {
      const result = await generateRoadmapAction(topic.trim());
      if (!result.success) {
        setError(result.error);
      }
      // On success, the action redirects to the detail page
    });
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Route className="size-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Generate a Learning Roadmap</CardTitle>
        <CardDescription>
          Enter any topic and AI will create a structured, ordered learning path
          from beginner to proficient.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roadmap-topic">What do you want to learn?</Label>
            <Input
              id="roadmap-topic"
              placeholder="e.g. Node.js, Machine Learning, React..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isPending}
              maxLength={256}
              autoFocus
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!topic.trim() || isPending}
            id="generate-roadmap-btn"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating roadmap…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate Roadmap
              </>
            )}
          </Button>

          {isPending && (
            <p className="text-center text-sm text-muted-foreground">
              AI is creating your personalized learning path. This may take a few
              seconds…
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
