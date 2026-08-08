"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toaster";
import { Field, getPath, setPath } from "@/components/admin/fields";
import { useResourceItem, useSaveResource, useSingleton } from "@/services/admin-client";
import type { ResourceFormDef } from "@/config/admin-fields";

interface ResourceFormProps {
  resource: string;
  def: ResourceFormDef;
  id?: string;
  /** Optional public URL for the "view live" button. */
  previewPath?: (values: Record<string, unknown>) => string | null;
}

/**
 * One form component for every content type. The shape comes from the field
 * config; validation errors come back from the API's Zod layer and are mapped
 * onto the fields that produced them.
 */
export function ResourceForm({ resource, def, id, previewPath }: ResourceFormProps) {
  const router = useRouter();
  const isNew = !id || id === "new";

  const singletonQuery = useSingleton<Record<string, unknown>>(resource);
  const itemQuery = useResourceItem<Record<string, unknown>>(resource, id);

  const query = def.singleton ? singletonQuery : itemQuery;
  const save = useSaveResource<Record<string, unknown>>(
    resource,
    def.singleton ? undefined : id,
  );

  const [values, setValues] = React.useState<Record<string, unknown>>(def.defaults);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [dirty, setDirty] = React.useState(false);
  const [tab, setTab] = React.useState(def.sections[0]?.id ?? "content");

  /* Hydrate once the record arrives; keep defaults for anything missing. */
  React.useEffect(() => {
    if (query.data) {
      setValues({ ...def.defaults, ...query.data });
      setDirty(false);
    } else if (def.singleton && query.isFetched && !query.data) {
      setValues(def.defaults);
    }
  }, [query.data, query.isFetched, def]);

  /* Warn before losing unsaved edits. */
  React.useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (path: string, next: unknown) => {
    setValues((current) => setPath(current, path, next));
    setErrors((current) => {
      if (!current[path]) return current;
      const copy = { ...current };
      delete copy[path];
      return copy;
    });
    setDirty(true);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    save.mutate(values, {
      onSuccess(saved) {
        setDirty(false);
        toast.success(`${def.singular} saved`, {
          description: "Public pages have been revalidated.",
        });
        if (isNew && !def.singleton && saved?._id) {
          router.replace(`/admin/${resource}/${saved._id}`);
        }
      },
      onError(error) {
        if (error.issues) {
          setErrors(
            Object.fromEntries(
              Object.entries(error.issues).map(([key, messages]) => [key, messages[0]]),
            ),
          );
          toast.error("Check the highlighted fields", { description: error.message });
        } else {
          toast.error("Couldn't save", { description: error.message });
        }
      },
    });
  };

  const preview = previewPath?.(values);

  if (query.isLoading) {
    return (
      <div className="grid h-64 place-items-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="pb-24">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-20 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/85 px-6 py-4 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          {!def.singleton && (
            <Button asChild variant="ghost" size="icon-sm" aria-label="Back to list">
              <Link href={`/admin/${resource}`}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-semibold tracking-tight">
              {isNew && !def.singleton
                ? `New ${def.singular}`
                : String(values[def.titleKey] ?? def.label)}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {dirty ? "Unsaved changes" : def.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {preview && (
            <Button asChild variant="outline" size="sm">
              <a href={preview} target="_blank" rel="noreferrer">
                <Eye className="size-3.5" />
                View live
              </a>
            </Button>
          )}
          <Button type="submit" variant="gradient" size="sm" loading={save.isPending}>
            <Save className="size-3.5" />
            Save
          </Button>
        </div>
      </div>

      {/* Sections */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 flex-wrap">
          {def.sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {def.sections.map((section) => {
          const sectionFields = def.fields.filter(
            (field) => (field.section ?? def.sections[0].id) === section.id,
          );

          return (
            <TabsContent key={section.id} value={section.id}>
              {section.description && (
                <p className="mb-5 text-sm text-muted-foreground">{section.description}</p>
              )}

              <div className="grid grid-cols-12 gap-5 rounded-2xl border border-border bg-card p-6">
                {sectionFields.length === 0 ? (
                  <p className="col-span-12 text-sm text-muted-foreground">
                    Nothing to configure here.
                  </p>
                ) : (
                  sectionFields.map((field) => (
                    <Field
                      key={field.name}
                      field={field}
                      value={getPath(values, field.name)}
                      error={errors[field.name] ?? errors[field.name.split(".")[0]]}
                      onChange={(next) => update(field.name, next)}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </form>
  );
}
