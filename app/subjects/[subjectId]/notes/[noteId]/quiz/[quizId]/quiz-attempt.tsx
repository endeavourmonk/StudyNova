"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Trophy, RotateCcw, ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { QuizQuestion } from "@/db/schemas/quizzes";

type QuizAttemptProps = {
  quizId: string;
  noteId: string;
  subjectId: string;
  noteTitle: string;
  questions: QuizQuestion[];
};

type Phase = "attempt" | "results";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function QuizAttempt({
  quizId,
  noteId,
  subjectId,
  noteTitle,
  questions,
}: QuizAttemptProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null),
  );
  const [phase, setPhase] = useState<Phase>("attempt");

  const allAnswered = selectedAnswers.every((a) => a !== null);

  function selectAnswer(questionIdx: number, optionIdx: number) {
    if (phase === "results") return;
    setSelectedAnswers((prev) => {
      const next = [...prev];
      next[questionIdx] = optionIdx;
      return next;
    });
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setPhase("results");
  }

  function handleRetry() {
    setSelectedAnswers(Array(questions.length).fill(null));
    setPhase("attempt");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const score = questions.reduce(
    (acc, q, i) => acc + (selectedAnswers[i] === q.correctAnswer ? 1 : 0),
    0,
  );
  const percentage = Math.round((score / questions.length) * 100);

  const scoreColor =
    percentage >= 80
      ? "text-emerald-500"
      : percentage >= 50
        ? "text-amber-500"
        : "text-destructive";

  const scoreBg =
    percentage >= 80
      ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
      : percentage >= 50
        ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
        : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";

  const scoreMessage =
    percentage === 100
      ? "Perfect score! 🎉"
      : percentage >= 80
        ? "Great job! Keep it up."
        : percentage >= 50
          ? "Good effort. Review the missed questions."
          : "Keep studying — you'll get there!";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="-ml-2" asChild>
          <Link href={`/subjects/${subjectId}/notes/${noteId}`}>
            <ChevronLeft />
            Back to note
          </Link>
        </Button>

        {phase === "results" && (
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RotateCcw className="size-4" />
            Retry quiz
          </Button>
        )}
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Quiz</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on: <span className="font-medium text-foreground">{noteTitle}</span>
        </p>
      </div>

      {/* Results summary banner */}
      {phase === "results" && (
        <div className={cn("rounded-xl border p-6 text-center", scoreBg)}>
          <Trophy className={cn("mx-auto mb-3 size-10", scoreColor)} />
          <p className={cn("text-4xl font-bold tabular-nums", scoreColor)}>
            {score} / {questions.length}
          </p>
          <p className="mt-1 text-lg font-medium">{percentage}%</p>
          <p className="mt-2 text-sm text-muted-foreground">{scoreMessage}</p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, qi) => {
          const selected = selectedAnswers[qi];
          const isCorrect = selected === q.correctAnswer;

          return (
            <Card
              key={`${quizId}-q${qi}`}
              className={cn(
                "transition-all",
                phase === "results" && isCorrect
                  ? "border-emerald-300 dark:border-emerald-700"
                  : phase === "results" && !isCorrect
                    ? "border-red-300 dark:border-red-700"
                    : "",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {/* Question number badge */}
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {qi + 1}
                  </span>
                  <CardTitle className="text-base leading-snug font-medium">
                    {q.question}
                  </CardTitle>
                </div>
                {phase === "results" && (
                  <CardDescription className="pl-10">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-4" /> Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-destructive">
                        <XCircle className="size-4" /> Incorrect
                      </span>
                    )}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-2 pl-10">
                {q.options.map((option, oi) => {
                  const isSelected = selected === oi;
                  const isCorrectOption = oi === q.correctAnswer;

                  let optionClass =
                    "flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-all";

                  if (phase === "attempt") {
                    optionClass += isSelected
                      ? " border-primary bg-primary/5 font-medium"
                      : " hover:border-primary/50 hover:bg-muted/50";
                  } else {
                    // results phase
                    if (isCorrectOption) {
                      optionClass +=
                        " border-emerald-400 bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700";
                    } else if (isSelected && !isCorrectOption) {
                      optionClass +=
                        " border-red-400 bg-red-50 text-red-700 line-through dark:bg-red-950/40 dark:text-red-400 dark:border-red-700";
                    } else {
                      optionClass += " opacity-50 cursor-default";
                    }
                  }

                  return (
                    <button
                      key={oi}
                      id={`q${qi}-opt${oi}`}
                      type="button"
                      className={optionClass}
                      onClick={() => selectAnswer(qi, oi)}
                      disabled={phase === "results"}
                      aria-pressed={isSelected}
                    >
                      {/* Letter badge */}
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="text-left">{option}</span>

                      {/* Result icon in results phase */}
                      {phase === "results" && isCorrectOption && (
                        <CheckCircle2 className="ml-auto size-4 shrink-0 text-emerald-500" />
                      )}
                      {phase === "results" && isSelected && !isCorrectOption && (
                        <XCircle className="ml-auto size-4 shrink-0 text-destructive" />
                      )}
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit / Retry */}
      {phase === "attempt" ? (
        <div className="flex flex-col items-start gap-2 pb-8">
          {!allAnswered && (
            <p className="text-sm text-muted-foreground">
              Answer all {questions.length} questions to submit.
            </p>
          )}
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!allAnswered}
            id="submit-quiz-btn"
          >
            Submit Quiz
          </Button>
        </div>
      ) : (
        <div className="flex gap-3 pb-8">
          <Button variant="outline" onClick={handleRetry}>
            <RotateCcw className="size-4" />
            Retry quiz
          </Button>
          <Button asChild>
            <Link href={`/subjects/${subjectId}/notes/${noteId}`}>
              Back to note
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
