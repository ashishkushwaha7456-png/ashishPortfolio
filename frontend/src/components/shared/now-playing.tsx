"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiResponse, NowPlaying as NowPlayingData } from "@/types";

/**
 * Spotify "now playing" chip.
 *
 * Renders nothing at all when Spotify isn't configured or nothing is playing —
 * an empty state here would be noise, not information.
 */
export function NowPlaying({ className }: { className?: string }) {
  const { data } = useQuery<NowPlayingData>({
    queryKey: ["spotify"],
    queryFn: async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/spotify`);
      const json = (await response.json()) as ApiResponse<NowPlayingData>;
      return json.success ? json.data : { isPlaying: false };
    },
    refetchInterval: 45_000,
    staleTime: 30_000,
  });

  if (!data?.isPlaying || !data.title) return null;

  const progress =
    data.progress && data.duration ? (data.progress / data.duration) * 100 : 0;

  return (
    <a
      href={data.songUrl}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border bg-card/60 p-2.5 backdrop-blur transition-colors hover:border-primary/40",
        className,
      )}
    >
      {data.albumImageUrl ? (
        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={data.albumImageUrl}
            alt={data.album ?? ""}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary">
          <Music2 className="size-4 text-muted-foreground" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {/* Three bars, offset so they never pulse in unison. */}
          <span aria-hidden className="flex h-3 items-end gap-[2px]">
            {[0, 0.2, 0.4].map((delay) => (
              <span
                key={delay}
                className="w-[2px] animate-pulse rounded-full bg-[var(--success)]"
                style={{ height: "100%", animationDelay: `${delay}s` }}
              />
            ))}
          </span>
          <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">
            Now playing
          </span>
        </div>

        <p className="mt-0.5 truncate text-xs font-medium">{data.title}</p>
        <p className="truncate text-[0.6875rem] text-muted-foreground">{data.artist}</p>

        {progress > 0 && (
          <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-[var(--success)] transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </a>
  );
}
