"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignOutButton, UserAvatar } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
            SN
          </span>
          StudyNova
        </Link>

        {pathname === "/" && (
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="#features" className="transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </Link>
          <Link href="#note-format" className="transition-colors hover:text-foreground">
            Note format
          </Link>
        </nav>)}

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app">Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/stats">Stats</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/roadmaps">Roadmaps</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  <UserAvatar />
                </span>
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </Button>
            <SignOutButton>
              <Button variant="outline" size="sm">
                Sign out
              </Button>
            </SignOutButton>
          </Show>
        </div>
      </div>
    </header>
  );
}
