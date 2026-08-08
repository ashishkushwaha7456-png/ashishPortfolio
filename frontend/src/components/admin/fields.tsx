"use client";

import * as React from "react";
import Image from "next/image";
import { GripVertical, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { useUpload } from "@/services/admin-client";
import { cn } from "@/lib/utils";
import type { FieldDef } from "@/config/admin-fields";

/* ── Nested value helpers ────────────────────────────────────
   Field names use dot paths (`timeline.start`), so reading and
   writing has to walk the object rather than index it directly.
   ──────────────────────────────────────────────────────────── */

export function getPath(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === "object"
          ? (value as Record<string, unknown>)[key]
          : undefined,
      source,
    );
}

export function setPath<T extends Record<string, unknown>>(
  source: T,
  path: string,
  value: unknown,
): T {
  const keys = path.split(".");
  const next = { ...source } as Record<string, unknown>;
  let cursor = next;

  keys.slice(0, -1).forEach((key) => {
    const existing = cursor[key];
    cursor[key] =
      existing && typeof existing === "object" && !Array.isArray(existing)
        ? { ...(existing as Record<string, unknown>) }
        : {};
    cursor = cursor[key] as Record<string, unknown>;
  });

  cursor[keys[keys.length - 1]] = value;
  return next as T;
}

interface FieldProps {
  field: FieldDef;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

/**
 * Written out in full rather than interpolated — Tailwind scans source text,
 * so `sm:col-span-${n}` would never make it into the stylesheet.
 */
const SPAN_CLASS: Record<number, string> = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
  7: "sm:col-span-7",
  8: "sm:col-span-8",
  9: "sm:col-span-9",
  10: "sm:col-span-10",
  11: "sm:col-span-11",
  12: "sm:col-span-12",
};

/** Renders any field type from the admin field config. */
export function Field({ field, value, error, onChange }: FieldProps) {
  const id = React.useId();

  return (
    <div className={cn("col-span-12 space-y-2", SPAN_CLASS[field.span ?? 12])}>
      {field.type !== "switch" && (
        <Label htmlFor={id} required={field.required}>
          {field.label}
        </Label>
      )}

      <FieldControl field={field} value={value} onChange={onChange} id={id} />

      {field.help && !error && (
        <p className="text-xs text-muted-foreground">{field.help}</p>
      )}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
  id,
}: FieldProps & { id: string }) {
  switch (field.type) {
    case "textarea":
    case "markdown":
      return (
        <Textarea
          id={id}
          rows={field.rows ?? (field.type === "markdown" ? 18 : 3)}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={field.type === "markdown" ? "font-mono text-[0.8125rem]" : undefined}
        />
      );

    case "number":
      return (
        <Input
          id={id}
          type="number"
          min={field.min}
          max={field.max}
          value={value === undefined || value === null ? "" : String(value)}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        />
      );

    case "slider":
      return (
        <div className="flex items-center gap-4">
          <input
            id={id}
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 100}
            value={Number(value ?? 0)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--primary)]"
          />
          <span className="w-12 shrink-0 text-right font-mono text-sm tabular-nums">
            {String(value ?? 0)}
          </span>
        </div>
      );

    case "select":
      return (
        <Select value={String(value ?? "")} onValueChange={onChange}>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "switch":
      return (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-2.5">
          <Switch id={id} checked={Boolean(value)} onCheckedChange={onChange} />
          <Label htmlFor={id} className="cursor-pointer">
            {field.label}
          </Label>
        </div>
      );

    case "date":
      return (
        <Input
          id={id}
          type="date"
          value={toDateInput(value)}
          onChange={(e) => onChange(e.target.value || null)}
        />
      );

    case "tags":
      return <TagsInput id={id} value={(value as string[]) ?? []} onChange={onChange} />;

    case "list":
      return <ListInput value={(value as string[]) ?? []} onChange={onChange} rows={field.rows} />;

    case "image":
      return <ImageInput id={id} value={String(value ?? "")} onChange={onChange} />;

    case "group":
      return (
        <GroupInput
          field={field}
          value={(value as Record<string, unknown>[]) ?? []}
          onChange={onChange}
        />
      );

    default:
      return (
        <Input
          id={id}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

/** ISO strings, Date objects and `YYYY-MM-DD` all normalise to the input format. */
function toDateInput(value: unknown) {
  if (!value) return "";
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

/* ── Tags ─────────────────────────────────────────────────── */
function TagsInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [draft, setDraft] = React.useState("");

  const add = (raw: string) => {
    const items = raw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item && !value.includes(item));
    if (items.length) onChange([...value, ...items]);
    setDraft("");
  };

  return (
    <div className="rounded-xl border border-input bg-background/60 p-2">
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                aria-label={`Remove ${tag}`}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => draft && add(draft)}
        placeholder="Type and press Enter…"
        className="w-full bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground/70"
      />
    </div>
  );
}

/* ── String list (one item per row) ───────────────────────── */
function ListInput({
  value,
  onChange,
  rows = 2,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  rows?: number;
}) {
  const update = (index: number, next: string) => {
    const copy = [...value];
    copy[index] = next;
    onChange(copy);
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const copy = [...value];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <button
            type="button"
            onClick={() => move(index, -1)}
            aria-label="Move up"
            className="mt-2.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
            disabled={index === 0}
          >
            <GripVertical className="size-4" />
          </button>
          <Textarea
            rows={rows}
            value={item}
            onChange={(e) => update(index, e.target.value)}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            aria-label="Remove item"
            className="mt-2.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, ""])}>
        <Plus className="size-3.5" />
        Add item
      </Button>
    </div>
  );
}

/* ── Image / file ─────────────────────────────────────────── */
function ImageInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const upload = useUpload();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    upload.mutate(
      { file },
      {
        onSuccess(result) {
          onChange(result.url);
          toast.success("Uploaded");
        },
        onError(error) {
          toast.error("Upload failed", { description: error.message });
        },
      },
    );
  };

  const isImage = value && !value.endsWith(".pdf");

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/… or https://…"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
        >
          {upload.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          Upload
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {value && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-3">
          {isImage ? (
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
              <Image src={value} alt="" fill sizes="64px" className="object-cover" />
            </div>
          ) : (
            <div className="grid size-16 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-xs font-medium">
              PDF
            </div>
          )}
          <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
            {value}
          </p>
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear"
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Repeatable object group ──────────────────────────────── */
function GroupInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: Record<string, unknown>[];
  onChange: (value: Record<string, unknown>[]) => void;
}) {
  // Memoised so the `blank` row template below has a stable dependency.
  const subfields = React.useMemo(() => field.fields ?? [], [field.fields]);

  const blank = React.useMemo(
    () =>
      Object.fromEntries(
        subfields.map((sub) => [
          sub.name,
          sub.type === "tags" || sub.type === "list"
            ? []
            : sub.type === "switch"
              ? false
              : "",
        ]),
      ),
    [subfields],
  );

  const updateRow = (index: number, key: string, next: unknown) => {
    const copy = [...value];
    copy[index] = setPath(copy[index] ?? {}, key, next);
    onChange(copy);
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const copy = [...value];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      {value.map((row, index) => (
        <div key={index} className="rounded-xl border border-border bg-background/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">
              #{String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                aria-label="Move down"
                className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label="Remove"
                className="rounded p-1 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {subfields.map((sub) => (
              <Field
                key={sub.name}
                field={sub}
                value={getPath(row, sub.name)}
                onChange={(next) => updateRow(index, sub.name, next)}
              />
            ))}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, { ...blank }])}
      >
        <Plus className="size-3.5" />
        Add {field.label.toLowerCase().replace(/s$/, "")}
      </Button>
    </div>
  );
}
