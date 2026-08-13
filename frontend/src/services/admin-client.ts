"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { ApiResponse, ApiSuccess } from "@/types";
import { COOKIE_NAME } from "@/constants/site";

/** Thrown by `request` so React Query can branch on HTTP status. */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public issues?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// All client-side API calls go through the Next.js backend proxy at /api/backend.
// The proxy forwards them server-side to the Express backend (no mixed-content).
// NEXT_PUBLIC_API_URL is NOT used client-side to avoid embedding the EC2 IP in the bundle.
const PROXY_BASE = "/api/backend";

let isHandling401 = false;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("portfolio_admin_token");
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_admin_token", token);
  }
}

export function clearAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("portfolio_admin_token");
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  }
}

async function requestEnvelope<T>(url: string, init?: RequestInit): Promise<ApiSuccess<T>> {
  const targetUrl = url.startsWith("/api/backend")
    ? url
    : url.startsWith("/api/")
      ? PROXY_BASE + url.slice("/api".length)
      : url;
  const token = getToken();

  const headers: Record<string, string> = {};
  if (!(init?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(targetUrl, {
    ...init,
    credentials: "include",
    headers: {
      ...headers,
      ...init?.headers,
    },
  });

  if (response.status === 401) {
    clearAuth();

    if (typeof window !== "undefined") {
      void fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});

      const pathname = window.location.pathname;
      if (!pathname.startsWith("/admin/login") && !isHandling401) {
        isHandling401 = true;
        window.location.replace("/admin/login");
        setTimeout(() => {
          isHandling401 = false;
        }, 3000);
      }
    }

    let errorMsg = "Unauthorized";
    try {
      const json = await response.json();
      if (json.error) errorMsg = json.error;
    } catch {}
    throw new ApiError(errorMsg, 401);
  }

  let json: ApiResponse<T>;
  try {
    json = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(response.statusText || "Request failed", response.status);
  }

  if (!response.ok || !json.success) {
    const failure = json as { error?: string; issues?: Record<string, string[]> };
    throw new ApiError(failure.error ?? "Request failed", response.status, failure.issues);
  }

  return json as ApiSuccess<T>;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const envelope = await requestEnvelope<T>(url, init);
  return envelope.data;
}

const base = (resource: string) => `/api/admin/content/${resource}`;

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

export interface ListResult<T> {
  items: T[];
  total: number;
  pages: number;
}

/* ── Queries ──────────────────────────────────────────────── */

export function useResourceList<T>(
  resource: string,
  params: ListParams = {},
  options?: Partial<UseQueryOptions<ListResult<T>, ApiError>>,
) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== "all") {
      search.set(key, String(value));
    }
  }

  return useQuery<ListResult<T>, ApiError>({
    queryKey: ["admin", resource, params],
    queryFn: async () => {
      const json = await requestEnvelope<T[]>(`${base(resource)}?${search}`);
      return {
        items: json.data,
        total: json.meta?.total ?? json.data.length,
        pages: json.meta?.pages ?? 1,
      };
    },
    ...options,
  });
}

export function useResourceItem<T>(resource: string, id?: string) {
  return useQuery<T, ApiError>({
    queryKey: ["admin", resource, "item", id],
    queryFn: () => request<T>(`${base(resource)}/${id}`),
    enabled: Boolean(id) && id !== "new",
  });
}

/** Singletons (hero, about, seo, settings) return the document directly. */
export function useSingleton<T>(resource: string) {
  return useQuery<T | null, ApiError>({
    queryKey: ["admin", resource, "singleton"],
    queryFn: () => request<T | null>(base(resource)),
  });
}

/* ── Mutations ────────────────────────────────────────────── */

export function useSaveResource<T>(resource: string, id?: string) {
  const queryClient = useQueryClient();

  return useMutation<T, ApiError, Record<string, unknown>>({
    mutationFn: (values) =>
      id && id !== "new"
        ? request<T>(`${base(resource)}/${id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        })
        : request<T>(base(resource), {
          method: "POST",
          body: JSON.stringify(values),
        }),
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: ["admin", resource] });
    },
  });
}

export function useDeleteResource(resource: string) {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, ApiError, string>({
    mutationFn: (id) => request(`${base(resource)}/${id}`, { method: "DELETE" }),
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: ["admin", resource] });
    },
  });
}

export function useUpload() {
  return useMutation<
    { url: string; publicId: string; width?: number; height?: number; type: string },
    ApiError,
    { file: File; folder?: string }
  >({
    mutationFn: ({ file, folder }) => {
      const form = new FormData();
      form.set("file", file);
      if (folder) form.set("folder", folder);
      return request("/api/admin/upload", { method: "POST", body: form });
    },
  });
}

export function useRevalidate() {
  return useMutation<{ revalidated: string[] }, ApiError, { paths?: string[]; all?: boolean }>({
    mutationFn: (body) =>
      request("/api/admin/revalidate", { method: "POST", body: JSON.stringify(body) }),
  });
}

export function useSeed() {
  const queryClient = useQueryClient();
  return useMutation<{ counts: Record<string, number> }, ApiError, void>({
    mutationFn: () => request("/api/admin/seed", { method: "POST" }),
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useAnalytics(days = 30) {
  return useQuery({
    queryKey: ["admin", "analytics", days],
    queryFn: () => request<import("@/types").AnalyticsSummary>(`/api/admin/analytics?days=${days}`),
    staleTime: 60_000,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      // Call the Next.js proxy directly (not via requestEnvelope) so the
      // httpOnly session cookie is cleared server-side by clearSessionCookie().
      // requestEnvelope would rewrite "/api/…" → backend URL, bypassing the proxy.
      const res = await fetch("/api/admin/auth/logout", { method: "POST" });
      const json = (await res.json()) as { success: boolean; data?: { signedOut: boolean } };
      return json.data ?? { signedOut: true };
    },
  });
}
