"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Database,
  Download,
  Eye,
  FolderKanban,
  Mail,
  MousePointerClick,
  PenLine,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toaster";
import {
  useAnalytics,
  useResourceList,
  useRevalidate,
  useSeed,
} from "@/services/admin-client";
import { cn, compactNumber, formatDate } from "@/lib/utils";
import type { Message } from "@/types";

const DEVICE_COLORS = ["#6366f1", "#22d3ee", "#f59e0b"];

export function DashboardOverview({
  userName,
  databaseConfigured: initialDbConfigured,
}: {
  userName: string;
  databaseConfigured: boolean;
}) {
  const [days, setDays] = React.useState(30);
  const analytics = useAnalytics(days);
  const messages = useResourceList<Message>("messages", { limit: 5 });
  const projects = useResourceList("projects", { limit: 1 });
  const posts = useResourceList("blog", { limit: 1 });
  const seed = useSeed();
  const revalidate = useRevalidate();

  const summary = analytics.data;
  const databaseConfigured = summary?.databaseConfigured ?? initialDbConfigured;

  const tiles = [
    {
      label: "Page views",
      value: summary?.totalViews ?? 0,
      change: summary?.viewsChange ?? 0,
      icon: Eye,
    },
    {
      label: "Unique visitors",
      value: summary?.uniqueVisitors ?? 0,
      icon: Users,
    },
    {
      label: "Messages",
      value: summary?.messages ?? 0,
      icon: Mail,
    },
    {
      label: "Resume downloads",
      value: summary?.resumeDownloads ?? 0,
      icon: Download,
    },
  ];

  return (
    <div className="space-y-7">
      <AdminHeader
        title={`Welcome back, ${userName.split(" ")[0]}`}
        description="Traffic, recent messages and everything you can edit without touching code."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              loading={revalidate.isPending}
              onClick={() =>
                revalidate.mutate(
                  { all: true },
                  {
                    onSuccess: () => toast.success("Public pages refreshed"),
                    onError: (error) =>
                      toast.error("Refresh failed", { description: error.message }),
                  },
                )
              }
            >
              <RefreshCw className="size-3.5" />
              Refresh site
            </Button>
            <Button asChild variant="gradient" size="sm">
              <Link href="/admin/projects/new">
                <Sparkles className="size-3.5" />
                New project
              </Link>
            </Button>
          </div>
        }
      />

      {/* Database notice */}
      {!databaseConfigured && (
        <div className="flex flex-col gap-4 rounded-2xl border border-[color-mix(in_oklch,var(--warning)_35%,transparent)] bg-[color-mix(in_oklch,var(--warning)_8%,transparent)] p-5 sm:flex-row sm:items-center">
          <AlertTriangle className="size-5 shrink-0 text-[var(--warning)]" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Running on seed content</p>
            <p className="mt-1 text-sm text-muted-foreground">
              No <code className="font-mono text-xs">MONGODB_URI</code> is set, so the site is
              rendering from <code className="font-mono text-xs">src/constants/seed-data.ts</code>.
              The public pages look correct, but nothing here can be saved until a database is
              connected.
            </p>
          </div>
        </div>
      )}

      {databaseConfigured && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
          <Database className="size-5 shrink-0 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Seed the database</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Copies the resume-derived content into MongoDB so it becomes editable here.
              Safe to run more than once — existing records are updated, not duplicated.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            loading={seed.isPending}
            onClick={() =>
              seed.mutate(undefined, {
                onSuccess: (data) =>
                  toast.success("Content seeded", {
                    description: `${Object.values(data.counts).reduce((a, b) => a + b, 0)} records written.`,
                  }),
                onError: (error) => toast.error("Seed failed", { description: error.message }),
              })
            }
          >
            Run seeder
          </Button>
        </div>
      )}

      {/* Range selector */}
      <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/50 p-0.5 w-fit">
        {[7, 30, 90].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setDays(value)}
            aria-pressed={days === value}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
              days === value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {value} days
          </button>
        ))}
      </div>

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => {
          const TileIcon = tile.icon;
          const positive = (tile.change ?? 0) >= 0;
          return (
            <div key={tile.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <TileIcon className="size-4 text-primary" />
                {tile.change !== undefined && tile.change !== 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium",
                      positive ? "text-[var(--success)]" : "text-destructive",
                    )}
                  >
                    {positive ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {Math.abs(tile.change)}%
                  </span>
                )}
              </div>

              {analytics.isLoading ? (
                <Skeleton className="mt-4 h-8 w-20" />
              ) : (
                <p className="mt-4 font-display text-3xl font-semibold tracking-tight">
                  {compactNumber(tile.value)}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{tile.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold">Traffic</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Page views and unique visitors over the last {days} days.
          </p>

          <div className="mt-6 h-64">
            {analytics.isLoading ? (
              <Skeleton className="size-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary?.byDay ?? []}>
                  <defs>
                    <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="visitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickFormatter={(value: string) => value.slice(5)}
                    minTickGap={24}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    width={32}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    labelFormatter={(value) => formatDate(String(value), { day: "numeric", month: "short" })}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#views)"
                    name="Views"
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    fill="url(#visitors)"
                    name="Visitors"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold">Devices</h2>
          <p className="mt-1 text-xs text-muted-foreground">How visitors reach the site.</p>

          <div className="mt-4 h-44">
            {analytics.isLoading ? (
              <Skeleton className="size-full" />
            ) : (summary?.byDevice.length ?? 0) === 0 ? (
              <div className="grid h-full place-items-center text-xs text-muted-foreground">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary?.byDevice ?? []}
                    dataKey="count"
                    nameKey="device"
                    innerRadius={44}
                    outerRadius={68}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {(summary?.byDevice ?? []).map((_, index) => (
                      <Cell key={index} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <ul className="mt-4 space-y-2">
            {(summary?.byDevice ?? []).map((item, index) => (
              <li key={item.device} className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-2 capitalize">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: DEVICE_COLORS[index % DEVICE_COLORS.length] }}
                  />
                  {item.device}
                </span>
                <span className="font-mono text-muted-foreground">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Messages + top pages */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent messages</h2>
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              View all
              <ArrowUpRight className="size-3" />
            </Link>
          </div>

          {messages.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (messages.data?.items.length ?? 0) === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No messages yet. The contact form writes here.
            </p>
          ) : (
            <ul className="space-y-2">
              {messages.data?.items.map((message) => (
                <li key={message._id}>
                  <Link
                    href="/admin/messages"
                    className="flex items-start gap-3 rounded-xl border border-border p-3.5 transition-colors hover:border-primary/40"
                  >
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                      {message.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{message.subject}</p>
                        {!message.read && (
                          <Badge variant="default" size="sm">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {message.name} · {message.email}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[0.6875rem] text-muted-foreground">
                      {formatDate(message.createdAt, { day: "numeric", month: "short" })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-5 text-sm font-semibold">Most visited pages</h2>

          {analytics.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (summary?.topPages.length ?? 0) === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No page views recorded yet.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {summary?.topPages.map((page) => {
                const max = summary.topPages[0]?.views || 1;
                return (
                  <li key={page.path}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                      <span className="truncate font-mono">{page.path}</span>
                      <span className="shrink-0 text-muted-foreground">{page.views}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(page.views / max) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/admin/projects", label: "Projects", icon: FolderKanban, count: projects.data?.total },
          { href: "/admin/blog", label: "Blog posts", icon: PenLine, count: posts.data?.total },
          { href: "/admin/messages", label: "Messages", icon: Mail, count: messages.data?.total },
          { href: "/admin/analytics", label: "Analytics", icon: MousePointerClick },
        ].map((item) => {
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ItemIcon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  {item.count !== undefined && (
                    <p className="text-xs text-muted-foreground">{item.count} total</p>
                  )}
                </div>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
