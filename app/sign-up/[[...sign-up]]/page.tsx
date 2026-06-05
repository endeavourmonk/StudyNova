import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
      <div className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>

      <SignUp forceRedirectUrl="/app" />
    </div>
  );
}
