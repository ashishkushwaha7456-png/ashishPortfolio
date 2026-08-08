import type { Request, Response } from "express";
import type { LeetCodeStats, NowPlaying } from "@/types";
import { PERSON } from "@/constants/site";
import { asyncHandler } from "@/utils/async-handler";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";
const LEETCODE_QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile { ranking }
      submitStatsGlobal { acSubmissionNum { difficulty count } }
    }
    allQuestionsCount { difficulty count }
  }`;

export const getSpotifyNowPlaying = asyncHandler(async (req: Request, res: Response) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  const offline: NowPlaying = { isPlaying: false };
  if (!clientId || !clientSecret || !refreshToken) {
    return res.json({ success: true, data: offline });
  }

  try {
    const tokenResponse = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!tokenResponse.ok) return res.json({ success: true, data: offline });
    const { access_token } = (await tokenResponse.json()) as { access_token?: string };
    if (!access_token) return res.json({ success: true, data: offline });

    const playing = await fetch(SPOTIFY_NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (playing.status === 204 || !playing.ok) {
      return res.json({ success: true, data: offline });
    }

    const data = (await playing.json()) as {
      is_playing: boolean;
      progress_ms: number;
      item?: {
        name: string;
        duration_ms: number;
        album: { name: string; images: { url: string }[] };
        artists: { name: string }[];
        external_urls: { spotify: string };
      };
    };

    if (!data.item) return res.json({ success: true, data: offline });

    const result: NowPlaying = {
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: data.item.artists.map((a) => a.name).join(", "),
      album: data.item.album.name,
      albumImageUrl: data.item.album.images[0]?.url,
      songUrl: data.item.external_urls.spotify,
      progress: data.progress_ms,
      duration: data.item.duration_ms,
    };

    res.json({ success: true, data: result });
  } catch (error) {
    res.json({ success: true, data: offline });
  }
});

export const getLeetCodeStats = asyncHandler(async (req: Request, res: Response) => {
  const username =
    (req.query.username as string) ??
    process.env.LEETCODE_USERNAME ??
    process.env.NEXT_PUBLIC_LEETCODE_USERNAME;

  if (!username) {
    return res.status(404).json({ success: false, error: "No LeetCode username configured" });
  }

  try {
    const response = await fetch(LEETCODE_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({ query: LEETCODE_QUERY, variables: { username } }),
    });

    if (!response.ok) {
      return res.status(404).json({ success: false, error: "LeetCode is unavailable" });
    }

    const json = (await response.json()) as {
      data?: {
        matchedUser?: {
          username: string;
          profile: { ranking: number };
          submitStatsGlobal: {
            acSubmissionNum: { difficulty: string; count: number }[];
          };
        };
        allQuestionsCount?: { difficulty: string; count: number }[];
      };
    };

    const user = json.data?.matchedUser;
    if (!user) {
      return res.status(404).json({ success: false, error: "LeetCode profile not found" });
    }

    const solved = Object.fromEntries(
      user.submitStatsGlobal.acSubmissionNum.map((entry) => [entry.difficulty, entry.count])
    );
    const totals = Object.fromEntries(
      (json.data?.allQuestionsCount ?? []).map((entry) => [entry.difficulty, entry.count])
    );

    const totalSolved = solved.All ?? 0;
    const totalQuestions = totals.All ?? 0;

    const result: LeetCodeStats = {
      username: user.username,
      ranking: user.profile.ranking,
      totalSolved,
      easySolved: solved.Easy ?? 0,
      mediumSolved: solved.Medium ?? 0,
      hardSolved: solved.Hard ?? 0,
      totalQuestions,
      acceptanceRate: totalQuestions
        ? Math.round((totalSolved / totalQuestions) * 1000) / 10
        : 0,
      streak: 0,
    };

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, error: "LeetCode is unavailable" });
  }
});
