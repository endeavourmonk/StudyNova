import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { Navbar } from "@/app/components/Navbar";
import { ProfileForm } from "@/app/profile/profile-form";
import { Button } from "@/components/ui/button";
import { fetchUserByClerkId } from "@/db/queries/users";

export default async function ProfilePage() {
  const { userId } = await auth.protect();

  const user = await fetchUserByClerkId(userId);

  if (!user) {
    return (
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-16">
          <p className="text-center text-muted-foreground">
            Your account is still being set up. Please try again in a moment.
          </p>
          <Button variant="outline" asChild>
            <Link href="/app">Back to dashboard</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <ProfileForm
          initialProfile={{
            userId: user.userId,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName ?? "",
            email: user.email,
          }}
        />
      </main>
    </div>
  );
}
