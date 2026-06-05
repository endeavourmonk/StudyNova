"use client";

import { useActionState, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import {
  createNoteAction,
  type NoteFormState,
  updateNoteAction,
} from "@/app/notes/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type NoteFormProps = {
  mode: "create" | "edit";
  subjectId: string;
  subjectName: string;
  noteId?: string;
  initialTitle?: string;
  initialTopic?: string;
  initialContent?: string | null;
};

type SubmitIntent = "create" | "generate";

function createInitialState(
  title = "",
  topic = "",
  content: string | null = null,
): NoteFormState {
  return { error: null, title, topic, content };
}

export function NoteForm({
  mode,
  subjectId,
  subjectName,
  noteId,
  initialTitle = "",
  initialTopic = "",
  initialContent = null,
}: NoteFormProps) {
  const action =
    mode === "create"
      ? createNoteAction.bind(null, subjectId)
      : updateNoteAction.bind(null, subjectId, noteId!);

  const [state, formAction, isPending] = useActionState(
    action,
    createInitialState(initialTitle, initialTopic, initialContent),
  );

  const [pendingIntent, setPendingIntent] = useState<SubmitIntent | null>(null);

  const title = state.title || initialTitle;
  const topic = state.topic || initialTopic;
  const content = state.content ?? initialContent ?? "";
  const formKey = `${title}-${topic}-${content.length}`;

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{mode === "create" ? "New note" : "Edit note"}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? `Write notes manually or generate them with AI for ${subjectName}.`
            : `Update this note in ${subjectName}.`}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title
              {mode === "create" && (
                <span className="ml-1 font-normal text-muted-foreground">
                  (optional for AI)
                </span>
              )}
            </Label>
            <Input
              id="title"
              name="title"
              key={`note-title-${formKey}`}
              defaultValue={title}
              placeholder="e.g. Third Normal Form"
              maxLength={256}
              required={mode === "edit"}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              name="topic"
              key={`note-topic-${formKey}`}
              defaultValue={topic}
              placeholder="e.g. Normalization"
              maxLength={256}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              Content
              {mode === "create" && (
                <span className="ml-1 font-normal text-muted-foreground">
                  (required for manual notes)
                </span>
              )}
            </Label>
            <Textarea
              id="content"
              name="content"
              key={`note-content-${formKey}`}
              defaultValue={content}
              placeholder={
                mode === "create"
                  ? "Write your notes here, or leave blank and use Generate with AI…"
                  : undefined
              }
              className="min-h-64 font-mono text-sm"
              required={mode === "edit"}
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex-wrap gap-2 py-4">
          {mode === "create" ? (
            <>
              <Button
                type="submit"
                name="intent"
                value="create"
                disabled={isPending}
                onClick={() => setPendingIntent("create")}
              >
                {isPending && pendingIntent === "create" ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Create note"
                )}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="generate"
                variant="secondary"
                disabled={isPending}
                onClick={() => setPendingIntent("generate")}
              >
                {isPending && pendingIntent === "generate" ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles />
                    Generate with AI
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
