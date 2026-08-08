"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toaster";
import { getPath } from "@/components/admin/fields";
import { useDeleteResource, useResourceList } from "@/services/admin-client";
import { cn, formatDate, truncate } from "@/lib/utils";
import { useDebounce } from "@/hooks";
import type { ResourceFormDef } from "@/config/admin-fields";

interface Row extends Record<string, unknown> {
  _id: string;
}

export function ResourceTable({
  resource,
  def,
}: {
  resource: string;
  def: ResourceFormDef;
}) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [pendingDelete, setPendingDelete] = React.useState<Row | null>(null);

  const debounced = useDebounce(search, 250);
  const query = useResourceList<Row>(resource, {
    page,
    limit: 20,
    search: debounced,
    status,
  });
  const remove = useDeleteResource(resource);

  React.useEffect(() => setPage(1), [debounced, status]);

  const rows = query.data?.items ?? [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{def.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{def.description}</p>
        </div>

        <Button asChild variant="gradient">
          <Link href={`/admin/${resource}/new`}>
            <Plus className="size-4" />
            New {def.singular}
          </Link>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${def.label.toLowerCase()}…`}
            aria-label={`Search ${def.label}`}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/50 p-0.5">
          {["all", "published", "draft", "archived"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              aria-pressed={status === value}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                status === value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {query.isLoading ? (
          <div className="grid h-56 place-items-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : query.isError ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium">Couldn&apos;t load {def.label.toLowerCase()}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{query.error.message}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => query.refetch()}>
              Retry
            </Button>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-14 text-center">
            <p className="font-display text-lg font-semibold">
              No {def.label.toLowerCase()} yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {debounced
                ? "Nothing matches that search."
                : `Create your first ${def.singular}, or seed the database from the dashboard.`}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-5">
              <Link href={`/admin/${resource}/new`}>
                <Plus className="size-3.5" />
                New {def.singular}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {def.columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th scope="col" className="w-24 px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row._id}
                    className="border-b border-border last:border-0 hover:bg-secondary/40"
                  >
                    {def.columns.map((column) => (
                      <td key={column.key} className="px-4 py-3">
                        <Cell type={column.type} value={getPath(row, column.key)} />
                      </td>
                    ))}

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon-sm" aria-label="Edit">
                          <Link href={`/admin/${resource}/${row._id}`}>
                            <Pencil className="size-3.5" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete"
                          onClick={() => setPendingDelete(row)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(query.data?.pages ?? 1) > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {query.data?.pages} · {query.data?.total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= (query.data?.pages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <Dialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this {def.singular}?</DialogTitle>
            <DialogDescription>
              &ldquo;{String(pendingDelete?.[def.titleKey] ?? "")}&rdquo; will be permanently
              removed. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              loading={remove.isPending}
              onClick={() => {
                if (!pendingDelete) return;
                remove.mutate(pendingDelete._id, {
                  onSuccess() {
                    toast.success(`${def.singular} deleted`);
                    setPendingDelete(null);
                  },
                  onError(error) {
                    toast.error("Couldn't delete", { description: error.message });
                  },
                });
              }}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Cell({ type, value }: { type?: string; value: unknown }) {
  if (type === "image") {
    return value ? (
      <div className="relative size-10 overflow-hidden rounded-lg border border-border bg-secondary">
        <Image src={String(value)} alt="" fill sizes="40px" className="object-cover" />
      </div>
    ) : (
      <div className="size-10 rounded-lg border border-dashed border-border" />
    );
  }

  if (type === "boolean") {
    return value ? (
      <Badge variant="success" size="sm">
        Yes
      </Badge>
    ) : (
      <span className="text-muted-foreground">—</span>
    );
  }

  if (type === "badge") {
    const text = String(value ?? "—");
    const variant =
      text === "published" ? "success" : text === "draft" ? "warning" : "secondary";
    return (
      <Badge variant={variant} size="sm" className="capitalize">
        {text.replace(/-/g, " ")}
      </Badge>
    );
  }

  if (type === "date") {
    return <span className="font-mono text-xs text-muted-foreground">{formatDate(value as string)}</span>;
  }

  return <span className="font-medium">{truncate(String(value ?? "—"), 60)}</span>;
}
