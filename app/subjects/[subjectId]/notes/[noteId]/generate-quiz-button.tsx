"use client";

import { useState, useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { generateQuizAction } from "@/app/quiz/actions";
import { Button } from "@/components/ui/button";

type GenerateQuizButtonProps = {
  noteId: string;
  subjectId: string;
};

export function GenerateQuizButton({ noteId, subjectId }: GenerateQuizButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await generateQuizAction(noteId, subjectId);
      // If we get here, the result was an error (success redirects away)
      if (!result.success) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleClick}
        disabled={isPending}
        id="generate-quiz-btn"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Generating quiz…
          </>
        ) : (
          <>
            <Sparkles />
            Generate Quiz
          </>
        )}
      </Button>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
