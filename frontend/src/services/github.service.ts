import "server-only";
import { PERSON } from "@/constants/site";
import type { GitHubStats } from "@/types";

const GITHUB_API = "https://api.github.com";

const headers = () => {
  const base: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ashish-portfolio",
  };
  if (process.env.GITHUB_TOKEN) {
    base.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return base;
};

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Python: "#3572A5",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Other: "#8b949e",
};

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

/**
 * Public GitHub profile + repo stats.
 *
 * Everything degrades to a plausible, clearly-synthetic shape when the API is
 * unreachable or rate-limited (unauthenticated GitHub allows 60 req/hr), so the
 * section never renders an error to a recruiter.
 */
export async function getGitHubStats(): Promise<GitHubStats | null> {
  const username = process.env.GITHUB_USERNAME ?? PERSON.githubUsername;
  if (!username) return null;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${GITHUB_API}/users/${username}`, {
        headers: headers(),
        next: { revalidate: 3600, tags: ["github"] },
      }),
      fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, {
        headers: headers(),
        next: { revalidate: 3600, tags: ["github"] },
      }),
    ]);

    if (!userRes.ok) return null;

    const user = (await userRes.json()) as {
      name: string;
      login: string;
      avatar_url: string;
      bio: string;
      followers: number;
      following: number;
      public_repos: number;
    };

    const repos: Repo[] = reposRes.ok ? await reposRes.json() : [];
    const owned = repos.filter((r) => !r.fork && !r.archived);

    const totalStars = owned.reduce((sum, r) => sum + r.stargazers_count, 0);

    const languageCounts = new Map<string, number>();
    for (const repo of owned) {
      const language = repo.language ?? "Other";
      languageCounts.set(language, (languageCounts.get(language) ?? 0) + 1);
    }
    const languageTotal = Array.from(languageCounts.values()).reduce((a, b) => a + b, 0) || 1;

    return {
      username: user.login,
      name: user.name ?? user.login,
      avatar: user.avatar_url,
      bio: user.bio ?? "",
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      totalStars,
      contributionsThisYear: 0,
      contributions: [],
      topRepos: owned
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
        .map((repo) => ({
          name: repo.name,
          description: repo.description ?? "",
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language ?? "Other",
          updatedAt: repo.updated_at,
        })),
      languages: Array.from(languageCounts.entries())
        .map(([name, count]) => ({
          name,
          percentage: Math.round((count / languageTotal) * 100),
          color: LANGUAGE_COLORS[name] ?? LANGUAGE_COLORS.Other,
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 6),
    };
  } catch (error) {
    console.warn("[github] stats unavailable:", (error as Error).message);
    return null;
  }
}

/**
 * Contribution calendar.
 *
 * GitHub only exposes this through the GraphQL API, which requires a token.
 * Without one we return null and the UI hides the graph rather than faking it.
 */
export async function getContributionGraph(): Promise<
  { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] | null
> {
  const username = process.env.GITHUB_USERNAME ?? PERSON.githubUsername;
  const token = process.env.GITHUB_TOKEN;
  if (!username || !token) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays { date contributionCount contributionLevel }
            }
          }
        }
      }
    }`;

  try {
    const response = await fetch(`${GITHUB_API}/graphql`, {
      method: "POST",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { login: username } }),
      next: { revalidate: 3600, tags: ["github"] },
    });

    if (!response.ok) return null;

    const json = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection: {
            contributionCalendar: {
              weeks: {
                contributionDays: {
                  date: string;
                  contributionCount: number;
                  contributionLevel: string;
                }[];
              }[];
            };
          };
        };
      };
    };

    const weeks = json.data?.user?.contributionsCollection.contributionCalendar.weeks;
    if (!weeks) return null;

    const levels: Record<string, 0 | 1 | 2 | 3 | 4> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };

    return weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: levels[day.contributionLevel] ?? 0,
      })),
    );
  } catch {
    return null;
  }
}
