"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { ThemeToggleButton } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toaster";
import { useQueryClient } from "@tanstack/react-query";
import { clearAuth, useLogout } from "@/services/admin-client";
import { ADMIN_NAV } from "@/constants/site";
import { cn, initials } from "@/lib/utils";
import { useLockBodyScroll } from "@/hooks";
import type { SessionUser } from "@/types";

export function AdminShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const logout = useLogout();

  useLockBodyScroll(open);
  React.useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/admin/dashboard" ? pathname === href : pathname.startsWith(href);

  const signOut = () => {
    clearAuth();
    logout.mutate(undefined, {
      onSuccess() {
        queryClient.clear();
        toast.success("Signed out");
        router.replace("/admin/login");
        router.refresh();
      },
      onError() {
        queryClient.clear();
        router.replace("/admin/login");
        router.refresh();
      },
    });
  };

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl border border-border bg-card font-display text-sm font-semibold">
              <span className="text-gradient">AK</span>
            </span>
            <span>
              <span className="block text-sm font-semibold leading-tight">Studio</span>
              <span className="block text-[0.6875rem] text-muted-foreground">
                Portfolio CMS
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-muted-foreground lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav aria-label="Admin" className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-0.5">
            {ADMIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  <Icon name={item.icon} size={16} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/"
            target="_blank"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <ExternalLink className="size-4" />
            View live site
          </Link>

          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <Avatar className="size-8">
              <AvatarFallback className="text-[0.625rem]">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs capitalize text-muted-foreground">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              aria-label="Sign out"
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Scrim */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ── Content ─────────────────────────────────────── */}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid size-9 place-items-center rounded-xl border border-border"
          >
            <Menu className="size-4" />
          </button>
          <span className="text-sm font-semibold">Portfolio Studio</span>
          <ThemeToggleButton />
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

/** Shared page heading for admin screens that aren't resource tables. */
export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
