import Link from "next/link";
import { GitFork, Github, Star, Users } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { cn, compactNumber, formatDate } from "@/lib/utils";
import type { GitHubStats as Stats } from "@/types";

const LEVEL_CLASS = [
  "bg-secondary",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
] as const;

interface GitHubStatsProps {
  stats: Stats | null;
  contributions?: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] | null;
}

export function GitHubStats({ stats, contributions }: GitHubStatsProps) {
  if (!stats) return null;

  const tiles = [
    { label: "Public repos", value: stats.publicRepos, icon: Github },
    { label: "Total stars", value: stats.totalStars, icon: Star },
    { label: "Followers", value: stats.followers, icon: Users },
    { label: "Top repos", value: stats.topRepos.length, icon: GitFork },
  ];

  return (
    <div className="space-y-8">
      {/* Tiles */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
        {tiles.map((tile) => {
          const TileIcon = tile.icon;
          return (
            <div key={tile.label} className="bg-background p-5">
              <TileIcon className="mb-3 size-4 text-primary" />
              <p className="font-display text-2xl font-semibold tracking-tight">
                <Counter value={tile.value} />
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{tile.label}</p>
            </div>
          );
        })}
      </div>

      {/* Contribution graph */}
      {contributions && contributions.length > 0 && (
        <Reveal className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Contribution activity</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Less
              {LEVEL_CLASS.map((cls, i) => (
                <span key={i} className={cn("size-2.5 rounded-[3px]", cls)} />
              ))}
              More
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
              {contributions.map((day) => (
                <span
                  key={day.date}
                  title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date, { day: "numeric", month: "short", year: "numeric" })}`}
                  className={cn("size-[10px] rounded-[2px]", LEVEL_CLASS[day.level])}
                />
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Language split */}
      {stats.languages.length > 0 && (
        <Reveal className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-5 text-sm font-semibold">Languages by repository</h3>

          <div className="flex h-2 overflow-hidden rounded-full">
            {stats.languages.map((language) => (
              <span
                key={language.name}
                style={{ width: `${language.percentage}%`, backgroundColor: language.color }}
                title={`${language.name} — ${language.percentage}%`}
              />
            ))}
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {stats.languages.map((language) => (
              <li key={language.name} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: language.color }}
                />
                <span className="font-medium">{language.name}</span>
                <span className="text-muted-foreground">{language.percentage}%</span>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {/* Top repositories */}
      {stats.topRepos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.topRepos.slice(0, 4).map((repo, index) => (
            <Reveal key={repo.name} delay={index * 0.06}>
              <Link
                href={repo.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-center gap-2">
                  <Github className="size-4 text-muted-foreground" />
                  <span className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                    {repo.name}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {repo.description || "No description provided."}
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3" />
                    {compactNumber(repo.stars)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="size-3" />
                    {compactNumber(repo.forks)}
                  </span>
                  <span className="ml-auto">{repo.language}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
