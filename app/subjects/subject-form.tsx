"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import {
  createSubjectAction,
  type SubjectFormState,
  updateSubjectAction,
} from "@/app/subjects/actions";
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

type SubjectFormProps = {
  mode: "create" | "edit";
  subjectId?: string;
  initialName?: string;
};

function createInitialState(name = ""): SubjectFormState {
  return { error: null, name };
}

export function SubjectForm({
  mode,
  subjectId,
  initialName = "",
}: SubjectFormProps) {
  const action =
    mode === "create"
      ? createSubjectAction
      : updateSubjectAction.bind(null, subjectId!);

  const [state, formAction, isPending] = useActionState(
    action,
    createInitialState(initialName),
  );

  const displayName = state.name || initialName;

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>{mode === "create" ? "New subject" : "Edit subject"}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Add a course or topic area to organize your notes."
            : "Rename this subject. Associated notes are unchanged."}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              key={`subject-name-${displayName}`}
              defaultValue={displayName}
              placeholder="e.g. DBMS, React, Operating Systems"
              maxLength={128}
              required
              autoFocus
            />
            <p className="text-sm text-muted-foreground">1–128 characters</p>
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
              "Create subject"
            ) : (
              "Save changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
