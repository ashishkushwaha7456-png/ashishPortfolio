"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, Eye, Mail, Users } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/services/admin-client";
import { cn, compactNumber, formatDate } from "@/lib/utils";

const RANGES = [7, 30, 90, 365] as const;
const BAR_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#22d3ee", "#38bdf8", "#f59e0b", "#f43f5e", "#10b981"];

const chartTooltip = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
} as const;

export function AnalyticsDashboard() {
  const [days, setDays] = React.useState<(typeof RANGES)[number]>(30);
  const { data, isLoading } = useAnalytics(days);

  const tiles = [
    { label: "Page views", value: data?.totalViews ?? 0, icon: Eye, change: data?.viewsChange },
    { label: "Unique visitors", value: data?.uniqueVisitors ?? 0, icon: Users },
    { label: "Messages received", value: data?.messages ?? 0, icon: Mail },
    { label: "Resume downloads", value: data?.resumeDownloads ?? 0, icon: Download },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Analytics"
        description="First-party, cookie-light traffic data. No third-party scripts, no cross-site tracking."
        action={
          <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/50 p-0.5">
            {RANGES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDays(value)}
                aria-pressed={days === value}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  days === value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {value === 365 ? "1 year" : `${value}d`}
              </button>
            ))}
          </div>
        }
      />

      {/* Tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => {
          const TileIcon = tile.icon;
          return (
            <div key={tile.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <TileIcon className="size-4 text-primary" />
                {tile.change !== undefined && tile.change !== 0 && (
                  <span
                    className={cn(
                      "text-xs font-medium",
                      tile.change > 0 ? "text-[var(--success)]" : "text-destructive",
                    )}
                  >
                    {tile.change > 0 ? "+" : ""}
                    {tile.change}%
                  </span>
                )}
              </div>
              {isLoading ? (
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

      {/* Trend */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Views vs visitors</h2>
        <div className="mt-6 h-72">
          {isLoading ? (
            <Skeleton className="size-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.byDay ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value: string) => value.slice(5)}
                  minTickGap={28}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  width={34}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={chartTooltip}
                  labelFormatter={(value) =>
                    formatDate(String(value), { day: "numeric", month: "short", year: "numeric" })
                  }
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="views"
                  name="Views"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Pages + referrers */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold">Top pages</h2>
          <div className="mt-6 h-72">
            {isLoading ? (
              <Skeleton className="size-full" />
            ) : (data?.topPages.length ?? 0) === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                No page views recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.topPages ?? []} layout="vertical" margin={{ left: 8 }}>
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="path"
                    tickLine={false}
                    axisLine={false}
                    width={110}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip contentStyle={chartTooltip} cursor={{ fill: "var(--secondary)" }} />
                  <Bar dataKey="views" radius={[0, 6, 6, 0]}>
                    {(data?.topPages ?? []).map((_, index) => (
                      <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold">Where visitors come from</h2>

          {isLoading ? (
            <Skeleton className="mt-6 h-64 w-full" />
          ) : (data?.byReferrer.length ?? 0) === 0 ? (
            <div className="grid h-64 place-items-center text-sm text-muted-foreground">
              Mostly direct traffic so far.
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {data?.byReferrer.map((item, index) => {
                const max = data.byReferrer[0]?.count || 1;
                let label = item.referrer;
                try {
                  label = new URL(item.referrer).hostname.replace(/^www\./, "");
                } catch {
                  /* not a URL — show it as-is */
                }
                return (
                  <li key={item.referrer}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                      <span className="truncate font-medium">{label}</span>
                      <span className="shrink-0 text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.count / max) * 100}%`,
                          backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
