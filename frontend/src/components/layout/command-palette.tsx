"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  FileText,
  Github,
  Linkedin,
  Mail,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { NAV_LINKS, PERSON, RESUME_FILE, SECONDARY_NAV_LINKS } from "@/constants/site";
import { cn } from "@/lib/utils";
import { useKeyboardShortcut } from "@/hooks";

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Actions" | "Connect" | "Theme";
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
}

/**
 * ⌘K palette. Keyboard-first navigation is table stakes for the audience this
 * site is aimed at, and it doubles as the site's search.
 */
export function CommandPalette() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [index, setIndex] = React.useState(0);

  useKeyboardShortcut("k", () => setOpen((v) => !v), { meta: true });
  useKeyboardShortcut("/", () => setOpen(true));

  const commands = React.useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      setOpen(false);
      router.push(href);
    };

    return [
      ...[...NAV_LINKS, ...SECONDARY_NAV_LINKS].map((link) => ({
        id: `nav-${link.href}`,
        label: link.label,
        hint: link.href,
        group: "Navigate" as const,
        icon: ArrowRight,
        run: go(link.href),
      })),
      {
        id: "resume",
        label: "Download resume",
        group: "Actions",
        icon: FileText,
        run: () => {
          setOpen(false);
          // Synthesised anchor click — /api/resume streams the file from the
          // backend resume record, so this saves it instead of navigating.
          const a = document.createElement("a");
          a.href = RESUME_FILE;
          a.download = "";
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
      },
      {
        id: "email",
        label: "Send an email",
        hint: PERSON.email,
        group: "Connect",
        icon: Mail,
        run: () => {
          setOpen(false);
          window.location.href = `mailto:${PERSON.email}`;
        },
      },
      {
        id: "github",
        label: "GitHub profile",
        group: "Connect",
        icon: Github,
        run: () => {
          setOpen(false);
          window.open(PERSON.github, "_blank", "noopener");
        },
      },
      {
        id: "linkedin",
        label: "LinkedIn profile",
        group: "Connect",
        icon: Linkedin,
        run: () => {
          setOpen(false);
          window.open(PERSON.linkedin, "_blank", "noopener");
        },
      },
      {
        id: "theme-light",
        label: "Switch to light theme",
        group: "Theme",
        icon: Sun,
        run: () => {
          setTheme("light");
          setOpen(false);
        },
      },
      {
        id: "theme-dark",
        label: "Switch to dark theme",
        group: "Theme",
        icon: Moon,
        run: () => {
          setTheme("dark");
          setOpen(false);
        },
      },
    ];
  }, [router, setTheme]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q),
    );
  }, [commands, query]);

  React.useEffect(() => setIndex(0), [query]);
  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((i) => (i + 1) % Math.max(1, filtered.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((i) => (i - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      filtered[index]?.run();
    }
  };

  const groups = React.useMemo(() => {
    const map = new Map<string, Command[]>();
    filtered.forEach((c) => {
      const list = map.get(c.group) ?? [];
      list.push(c);
      map.set(c.group, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  let cursor = -1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        hideClose
        className="top-[18%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0"
        onKeyDown={onKeyDown}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>

        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions, links…"
            aria-label="Search"
            className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {groups.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {groups.map(([group, items]) => (
            <div key={group} className="mb-1">
              <p className="px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </p>
              {items.map((command) => {
                cursor += 1;
                const active = cursor === index;
                const CommandIcon = command.icon;
                return (
                  <button
                    key={command.id}
                    type="button"
                    onMouseEnter={() => setIndex(filtered.indexOf(command))}
                    onClick={command.run}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      active ? "bg-secondary text-foreground" : "text-foreground/80",
                    )}
                  >
                    <CommandIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate">{command.label}</span>
                    {command.hint && (
                      <span className="truncate font-mono text-xs text-muted-foreground">
                        {command.hint}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
