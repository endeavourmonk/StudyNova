"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignOutButton, UserAvatar } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <Image
            src="/logo.png"
            alt="StudyNova Logo"
            width={90}
            height={80}
            className="rounded-lg"
          />
        </Link>

        {/* Desktop Navigation for Landing Page */}
        {pathname === "/" && (
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="#note-format"
              className="transition-colors hover:text-foreground"
            >
              Note format
            </Link>
          </nav>
        )}

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-2 md:flex">
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
                <span>Profile</span>
              </Link>
            </Button>
            <SignOutButton>
              <Button variant="outline" size="sm">
                Sign out
              </Button>
            </SignOutButton>
          </Show>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {pathname === "/" && (
              <div className="flex flex-col gap-4 border-b pb-4 text-sm text-muted-foreground">
                <Link
                  href="#features"
                  className="transition-colors hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="transition-colors hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How it works
                </Link>
                <Link
                  href="#note-format"
                  className="transition-colors hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Note format
                </Link>
              </div>
            )}

            <Show when="signed-out">
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button
                className="w-full justify-start"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/sign-up">Get started</Link>
              </Button>
            </Show>

            <Show when="signed-in">
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/app">Dashboard</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/app/stats">Stats</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/roadmaps">Roadmaps</Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/profile">
                  <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full">
                    <UserAvatar />
                  </span>
                  Profile
                </Link>
              </Button>
              <SignOutButton>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign out
                </Button>
              </SignOutButton>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
