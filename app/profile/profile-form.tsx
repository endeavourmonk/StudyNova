"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  checkUsernameAvailability,
  type ProfileData,
  type UpdateProfileState,
  updateProfile,
} from "@/app/profile/actions";
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

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

type ProfileFormProps = {
  initialProfile: ProfileData;
};

function createInitialState(profile: ProfileData): UpdateProfileState {
  return { error: null, success: null, profile };
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    createInitialState(initialProfile),
  );

  const savedProfile = state.profile;
  const [username, setUsername] = useState(savedProfile.username);
  const [usernameStatus, setUsernameStatus] =
    useState<UsernameStatus>("idle");

  useEffect(() => {
    setUsername(savedProfile.username);
    setUsernameStatus("idle");
  }, [savedProfile.username]);

  const runUsernameCheck = useCallback(
    async (value: string) => {
      if (value === savedProfile.username) {
        setUsernameStatus("idle");
        return;
      }

      if (value.length < 3 || !/^[a-z0-9_]+$/.test(value)) {
        setUsernameStatus("invalid");
        return;
      }

      setUsernameStatus("checking");

      try {
        const result = await checkUsernameAvailability(value);
        setUsernameStatus(
          result.status === "idle" ? "idle" : result.status,
        );
      } catch {
        setUsernameStatus("idle");
      }
    },
    [savedProfile.username],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      void runUsernameCheck(username);
    }, 400);

    return () => clearTimeout(timeout);
  }, [username, runUsernameCheck]);

  const usernameHint = (() => {
    switch (usernameStatus) {
      case "checking":
        return (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Checking availability…
          </span>
        );
      case "available":
        return (
          <span className="text-green-600 dark:text-green-500">
            Username is available
          </span>
        );
      case "taken":
        return (
          <span className="text-destructive">Username is already taken</span>
        );
      case "invalid":
        return (
          <span className="text-destructive">
            Use 3–64 characters: lowercase letters, numbers, and underscores
          </span>
        );
      default:
        return (
          <span className="text-muted-foreground">
            Lowercase letters, numbers, and underscores only
          </span>
        );
    }
  })();

  const usernameBlocked =
    usernameStatus === "taken" ||
    usernameStatus === "invalid" ||
    usernameStatus === "checking";

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your display name and username. Email cannot be changed here.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              defaultValue={savedProfile.email}
              disabled
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))
              }
              autoComplete="username"
              aria-invalid={usernameBlocked && usernameStatus !== "checking"}
              required
            />
            <p className="text-sm">{usernameHint}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                key={`firstName-${savedProfile.firstName}`}
                defaultValue={savedProfile.firstName}
                autoComplete="given-name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                key={`lastName-${savedProfile.lastName}`}
                defaultValue={savedProfile.lastName}
                autoComplete="family-name"
              />
            </div>
          </div>

          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
          {state.success && (
            <p
              className="text-sm text-green-600 dark:text-green-500"
              role="status"
            >
              {state.success}
            </p>
          )}
        </CardContent>
        <CardFooter className="py-4">
          <Button type="submit" disabled={isPending || usernameBlocked}>
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
