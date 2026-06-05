"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

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
  initialContent?: string;
};

function createInitialState(
  title = "",
  topic = "",
  content = "",
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
  initialContent = "",
}: NoteFormProps) {
  const action =
    mode === "create"
      ? createNoteAction.bind(null, subjectId)
      : updateNoteAction.bind(null, subjectId, noteId!);

  const [state, formAction, isPending] = useActionState(
    action,
    createInitialState(initialTitle, initialTopic, initialContent),
  );

  const title = state.title || initialTitle;
  const topic = state.topic || initialTopic;
  const content = state.content || initialContent;
  const formKey = `${title}-${topic}-${content.length}`;

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{mode === "create" ? "New note" : "Edit note"}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? `Add a study note to ${subjectName}.`
            : `Update this note in ${subjectName}.`}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              key={`note-title-${formKey}`}
              defaultValue={title}
              placeholder="e.g. Third Normal Form"
              maxLength={256}
              required
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
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              key={`note-content-${formKey}`}
              defaultValue={content}
              placeholder="Write your study notes here…"
              className="min-h-48"
              required
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
        </CardContent>
        <CardFooter className="gap-2 py-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Saving…
              </>
            ) : mode === "create" ? (
              "Create note"
            ) : (
              "Save changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
