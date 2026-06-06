import ReactMarkdown from "react-markdown";

type NoteContentViewProps = {
  content: string;
};

export function NoteContentView({ content }: NoteContentViewProps) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
          ),
          ul: ({ children }) => <ul className="list-disc pl-6">{children}</ul>,
          strong: ({ children }) => (
            <strong className="font-medium">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
