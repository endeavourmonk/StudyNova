import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sections = [
  { title: "Overview", preview: "Normalization reduces redundancy by organizing data into well-structured tables..." },
  { title: "Key Concepts", preview: "1NF, 2NF, 3NF, BCNF - each form builds on the previous..." },
  { title: "Detailed Explanation", preview: "Functional dependencies determine how attributes relate to candidate keys..." },
  { title: "Real World Examples", preview: "E-commerce order tables, student enrollment systems..." },
  { title: "Interview / Exam Questions", preview: "5 targeted questions with clear, concise answers..." },
  { title: "Summary", preview: "Bullet-point revision notes for quick review before exams." },
];

export function NotePreview() {
  return (
    <Card className="relative overflow-hidden border-border/60 bg-card/80 shadow-xl backdrop-blur-sm">
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 size-40 rounded-full bg-indigo-500/10 blur-3xl" />

      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">DBMS</Badge>
          <span className="text-xs text-muted-foreground">Generated in seconds</span>
        </div>
        <CardTitle className="text-xl">Database Normalization</CardTitle>
        <CardDescription>Topic: Normalization · Structured AI output</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5"
          >
            <p className="text-xs font-medium text-foreground">{section.title}</p>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {section.preview}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
