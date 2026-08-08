"use client";

import * as React from "react";
import {
  Archive,
  ArchiveRestore,
  CornerUpLeft,
  Loader2,
  Mail,
  MailOpen,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import {
  useDeleteResource,
  useResourceList,
  useSaveResource,
} from "@/services/admin-client";
import { cn, formatDateLong, truncate } from "@/lib/utils";
import { useDebounce } from "@/hooks";
import type { Message } from "@/types";

/**
 * Two-pane inbox. The list is the source of truth; the reading pane reads from
 * whichever row is selected, so a status change updates both at once.
 */
export function MessagesInbox() {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "unread" | "starred" | "archived">("all");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const debounced = useDebounce(search, 250);
  const query = useResourceList<Message & { _id: string }>("messages", {
    search: debounced,
    limit: 100,
  });
  const remove = useDeleteResource("messages");

  const all = React.useMemo(() => query.data?.items ?? [], [query.data]);

  const messages = React.useMemo(() => {
    switch (filter) {
      case "unread":
        return all.filter((m) => !m.read && !m.archived);
      case "starred":
        return all.filter((m) => m.starred);
      case "archived":
        return all.filter((m) => m.archived);
      default:
        return all.filter((m) => !m.archived);
    }
  }, [all, filter]);

  const selected = messages.find((m) => m._id === selectedId) ?? messages[0] ?? null;
  const unreadCount = all.filter((m) => !m.read && !m.archived).length;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Messages"
        description={
          unreadCount > 0
            ? `${unreadCount} unread ${unreadCount === 1 ? "message" : "messages"} from the contact form.`
            : "Everything from the contact form lands here."
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages…"
            aria-label="Search messages"
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/50 p-0.5">
          {(["all", "unread", "starred", "archived"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                filter === value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {value}
              {value === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-primary px-1.5 text-[0.625rem] text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {query.isLoading ? (
            <div className="grid h-64 place-items-center">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="p-10 text-center">
              <Mail className="mx-auto mb-3 size-6 text-muted-foreground" />
              <p className="text-sm font-medium">No messages</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {filter === "all" ? "The inbox is empty." : `Nothing ${filter}.`}
              </p>
            </div>
          ) : (
            <ul className="max-h-[70vh] divide-y divide-border overflow-y-auto">
              {messages.map((message) => (
                <li key={message._id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(message._id)}
                    aria-current={selected?._id === message._id}
                    className={cn(
                      "w-full px-4 py-3.5 text-left transition-colors hover:bg-secondary/50",
                      selected?._id === message._id && "bg-secondary/70",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {!message.read && (
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                      <p
                        className={cn(
                          "min-w-0 flex-1 truncate text-sm",
                          message.read ? "text-muted-foreground" : "font-semibold",
                        )}
                      >
                        {message.name}
                      </p>
                      {message.starred && (
                        <Star className="size-3 shrink-0 fill-[var(--warning)] text-[var(--warning)]" />
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs font-medium">{message.subject}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {truncate(message.message, 70)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reading pane */}
        <div className="rounded-2xl border border-border bg-card">
          {!selected ? (
            <div className="grid h-64 place-items-center text-sm text-muted-foreground">
              Select a message to read it.
            </div>
          ) : (
            <MessageDetail
              message={selected}
              onDelete={() =>
                remove.mutate(selected._id, {
                  onSuccess() {
                    toast.success("Message deleted");
                    setSelectedId(null);
                  },
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

function MessageDetail({
  message,
  onDelete,
}: {
  message: Message & { _id: string };
  onDelete: () => void;
}) {
  const save = useSaveResource<Message>("messages", message._id);

  /* Opening a message marks it read — once, not on every render. */
  const markedRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (message.read || markedRef.current === message._id) return;
    markedRef.current = message._id;
    save.mutate({ read: true });
  }, [message._id, message.read, save]);

  const toggle = (patch: Partial<Message>, label: string) => {
    save.mutate(patch as Record<string, unknown>, {
      onSuccess: () => toast.success(label),
      onError: (error) => toast.error("Couldn't update", { description: error.message }),
    });
  };

  return (
    <article className="p-6">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {message.subject}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{message.name}</span>{" "}
            <a href={`mailto:${message.email}`} className="hover:text-primary">
              &lt;{message.email}&gt;
            </a>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDateLong(message.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={message.starred ? "Unstar" : "Star"}
            onClick={() =>
              toggle({ starred: !message.starred }, message.starred ? "Unstarred" : "Starred")
            }
          >
            <Star
              className={cn(
                "size-4",
                message.starred && "fill-[var(--warning)] text-[var(--warning)]",
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={message.read ? "Mark unread" : "Mark read"}
            onClick={() => toggle({ read: !message.read }, "Updated")}
          >
            {message.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={message.archived ? "Unarchive" : "Archive"}
            onClick={() =>
              toggle(
                { archived: !message.archived },
                message.archived ? "Restored" : "Archived",
              )
            }
          >
            {message.archived ? (
              <ArchiveRestore className="size-4" />
            ) : (
              <Archive className="size-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete"
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 py-4">
        {message.projectType && <Badge variant="secondary">{message.projectType}</Badge>}
        {message.budget && <Badge variant="outline">{message.budget}</Badge>}
        {message.replied && <Badge variant="success">Replied</Badge>}
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        {message.message}
      </p>

      <footer className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <Button asChild variant="gradient" size="sm">
          <a href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}>
            <CornerUpLeft className="size-3.5" />
            Reply by email
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggle({ replied: !message.replied }, "Updated")}
        >
          {message.replied ? "Mark as not replied" : "Mark as replied"}
        </Button>

        {message.referrer && (
          <span className="ml-auto truncate font-mono text-xs text-muted-foreground">
            via {message.referrer}
          </span>
        )}
      </footer>
    </article>
  );
}
