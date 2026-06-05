"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import { deleteNoteAction } from "@/app/notes/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DeleteNoteButtonProps = {
  subjectId: string;
  noteId: string;
  noteTitle: string;
};

export function DeleteNoteButton({
  subjectId,
  noteId,
  noteTitle,
}: DeleteNoteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteNoteAction(subjectId, noteId);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete note?</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{noteTitle}</span> will
            be permanently deleted. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete note"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
