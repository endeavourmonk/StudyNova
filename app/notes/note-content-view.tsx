type NoteContentViewProps = {
  content: string;
};

export function NoteContentView({ content }: NoteContentViewProps) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
      <pre className="whitespace-pre-wrap font-sans text-muted-foreground">
        {content}
      </pre>
    </div>
  );
}
