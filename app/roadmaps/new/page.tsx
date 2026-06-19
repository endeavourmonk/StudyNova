import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Navbar } from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { RoadmapForm } from "../roadmap-form";

export default function NewRoadmapPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href="/roadmaps">
            <ChevronLeft />
            Roadmaps
          </Link>
        </Button>

        <RoadmapForm />
      </main>
    </div>
  );
}
