import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  FolderOpen,
  LayoutDashboard,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

import { Navbar } from "@/app/components/Navbar";
import { NotePreview } from "@/app/components/landing/note-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "AI note generation",
    description:
      "Enter a subject and topic - get structured study notes in seconds, not hours.",
  },
  {
    icon: FolderOpen,
    title: "Subject organization",
    description:
      "Group notes by DBMS, Operating Systems, React, or any course you are studying.",
  },
  {
    icon: Search,
    title: "Search & edit",
    description:
      "Find notes by title, topic, or content. Refine AI output to match how you learn.",
  },
  {
    icon: ClipboardCheck,
    title: "AI-powered quizzes",
    description:
      "Generate 5–8 MCQs from any note and test yourself with instant score feedback.",
  },
  {
    icon: LayoutDashboard,
    title: "Learning dashboard",
    description:
      "Track subjects, notes, and quizzes. See recent activity and jump back in fast.",
  },
  {
    icon: Zap,
    title: "Fast by design",
    description:
      "Built for speed - from topic to revision notes to self-assessment in one flow.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create a subject",
    description: "Set up containers for each course or certification you are preparing for.",
  },
  {
    step: "02",
    title: "Enter a topic",
    description: "Type any concept - like Normalization, React Hooks, or Process Scheduling.",
  },
  {
    step: "03",
    title: "Get structured notes",
    description: "AI generates overview, key concepts, examples, exam questions, and a summary.",
  },
  {
    step: "04",
    title: "Quiz yourself",
    description: "Turn notes into MCQs, attempt the quiz, and review what you got wrong.",
  },
];

const audiences = [
  "College students",
  "Engineering students",
  "Placement prep",
  "Self-learners",
  "Certification candidates",
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.75_0.12_280/0.18),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,oklch(1_0_0/0.8))]" />

          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
            <div className="space-y-8">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                <BrainCircuit className="size-3.5" />
                AI-powered study notes
              </Badge>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                  From topic to notes to quiz - in seconds
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground text-pretty">
                  StudyNova helps students generate high-quality, structured learning
                  material from any topic. Organize by subject, edit freely, and test
                  yourself with AI-generated quizzes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <span className="rounded-md bg-muted px-2.5 py-1">Topic</span>
                <ArrowRight className="size-4 shrink-0" />
                <span className="rounded-md bg-muted px-2.5 py-1">Structured notes</span>
                <ArrowRight className="size-4 shrink-0" />
                <span className="rounded-md bg-muted px-2.5 py-1">Self assessment</span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Start studying free
                    <ArrowRight />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Built for students who want to learn faster - not just store notes.
              </p>
            </div>

            <div className="lg:pl-4">
              <NotePreview />
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="border-b bg-muted/30 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Stop spending hours on notes. Start learning.
              </h2>
              <p className="mt-4 text-muted-foreground text-pretty">
                Most note apps focus on storage. StudyNova focuses on AI-assisted
                knowledge generation - summarizing concepts, organizing material, and
                helping you revise with quizzes so you actually retain what you study.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to study smarter
              </h2>
              <p className="mt-4 text-muted-foreground">
                A focused toolkit for generating, organizing, and testing your knowledge.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border/60 shadow-none">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-pretty">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-y bg-muted/20 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                How it works
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Four steps to better revision
              </h2>
              <p className="mt-4 text-muted-foreground">
                A simple flow designed around how students actually prepare for exams.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((item) => (
                <Card key={item.step} className="border-border/60 bg-background shadow-none">
                  <CardHeader>
                    <span className="font-mono text-sm font-medium text-muted-foreground">
                      {item.step}
                    </span>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-pretty">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Note format */}
        <section id="note-format" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <Badge variant="outline">Consistent structure</Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Every note follows a proven study format
                </h2>
                <p className="text-muted-foreground text-pretty">
                  AI-generated notes always include the sections you need for deep
                  understanding and quick revision - from overview to interview-ready
                  questions.
                </p>

                <ul className="space-y-3">
                  {[
                    "Overview & key concepts",
                    "Detailed explanation",
                    "Real-world examples",
                    "Interview / exam questions",
                    "Bullet-point summary",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <BookOpen className="size-3.5 text-primary" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Card className="border-border/60 bg-muted/20 shadow-none">
                <CardContent className="space-y-4 pt-6 font-mono text-sm">
                  <p className="text-muted-foreground"># Database Normalization</p>
                  <p className="text-muted-foreground">## Overview</p>
                  <p className="text-muted-foreground">## Key Concepts</p>
                  <p className="text-muted-foreground">## Detailed Explanation</p>
                  <p className="text-muted-foreground">## Real World Examples</p>
                  <p className="text-muted-foreground">## Interview / Exam Questions</p>
                  <p className="text-muted-foreground">## Summary</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Audience + CTA */}
        <section className="border-t bg-muted/30 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for serious learners
              </h2>
              <p className="mt-4 text-muted-foreground">
                Whether you are in college, prepping for placements, or studying for a
                certification - StudyNova adapts to your subjects and topics.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {audiences.map((audience) => (
                  <Badge key={audience} variant="secondary" className="px-3 py-1">
                    {audience}
                  </Badge>
                ))}
              </div>

              <Card className="mx-auto mt-12 max-w-xl border-border/60 text-left shadow-sm">
                <CardHeader>
                  <CardTitle>Ready to turn your next topic into notes?</CardTitle>
                  <CardDescription>
                    Sign up free and generate your first structured study note in under
                    a minute.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="lg" className="w-full sm:w-auto" asChild>
                    <Link href="/sign-up">
                      Create your account
                      <ArrowRight />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
              SN
            </span>
            StudyNova
          </div>
          <p>AI-powered study notes for students.</p>
        </div>
      </footer>
    </div>
  );
}
