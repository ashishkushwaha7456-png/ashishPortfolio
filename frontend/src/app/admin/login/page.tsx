import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { PERSON } from "@/constants/site";

export const metadata = {
  title: "Sign in · Portfolio Studio",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 py-16 noise">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-aurora animate-aurora" />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl border border-border bg-card font-display text-base font-semibold">
            <span className="text-gradient">AK</span>
          </span>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Portfolio Studio
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to manage {PERSON.name.split(" ")[0]}&apos;s content.
          </p>
        </div>

        <Suspense
          fallback={<div className="h-80 rounded-2xl border border-border bg-card" />}
        >
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected area. All sign-in attempts are rate limited.
        </p>
      </div>
    </main>
  );
}
