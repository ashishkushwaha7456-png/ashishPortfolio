"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { ApiResponse } from "@/types";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const targetUrl = url.startsWith("/api") ? url.replace("/api", API_URL) : url;
  const response = await fetch(targetUrl, {
    ...init,
    credentials: "include",
    headers:
      init?.body instanceof FormData
        ? init?.headers
        : { "Content-Type": "application/json", ...init?.headers },
  });

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

  return json.data;
}

const base = (resource: string) => `${API_URL}/admin/content/${resource}`;

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
      const response = await fetch(`${base(resource)}?${search}`, { credentials: "include" });
      const json = (await response.json()) as ApiResponse<T[]>;
      if (!response.ok || !json.success) {
        throw new ApiError(
          (json as { error?: string }).error ?? "Failed to load",
          response.status,
        );
      }
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
    mutationFn: () => request<{ signedOut: boolean }>("/api/admin/auth/logout", { method: "POST" }),
  });
}
