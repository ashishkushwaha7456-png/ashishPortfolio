"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { loginSchema, type LoginInput } from "@/schemas";
import type { ApiResponse, SessionUser } from "@/types";

import { setToken } from "@/services/admin-client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") ?? "/admin/dashboard";

  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const login = useMutation<SessionUser, Error, LoginInput>({
    mutationFn: async (values) => {
      // ↓ Call the Next.js proxy, NOT the Express backend directly.
      //   The proxy (/api/admin/auth/login) forwards to Express, reads the JWT
      //   from the response, and calls setSessionCookie() which sets the
      //   httpOnly `portfolio_session` cookie on the Next.js domain.
      //   That cookie is what the middleware and server-component guards read.
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, remember }),
      });
      const json = (await response.json()) as ApiResponse<{ user: SessionUser; token?: string }>;
      if (!response.ok || !json.success) {
        throw new Error((json as { error?: string }).error ?? "Sign in failed");
      }
      // Also persist the token in localStorage so admin-client.ts can attach
      // the Bearer header to subsequent API requests.
      if (json.data.token) {
        setToken(json.data.token);
      }
      return json.data.user;
    },
    onSuccess() {
      router.replace(redirectTo);
      // Refresh so the server layout picks up the new session cookie.
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => login.mutate(values))}
      className="space-y-5 rounded-2xl border border-border bg-card p-7 shadow-xl"
      noValidate
    >
      {login.isError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{login.error.message}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          autoFocus
          placeholder="you@example.com"
          error={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" required>
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            error={Boolean(errors.password)}
            className="pr-11"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Switch id="remember" checked={remember} onCheckedChange={setRemember} />
        <Label htmlFor="remember" className="cursor-pointer text-sm font-normal">
          Keep me signed in for a week
        </Label>
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        loading={login.isPending}
      >
        <LogIn className="size-4" />
        Sign in
      </Button>

      <Link
        href="/"
        className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3" />
        Back to the site
      </Link>
    </form>
  );
}
