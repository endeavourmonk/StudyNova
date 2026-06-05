import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
      <div className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </div>

      <SignIn forceRedirectUrl="/app" />
    </div>
  );
}
