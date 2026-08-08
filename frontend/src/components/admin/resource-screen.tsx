"use client";

import { ResourceForm } from "@/components/admin/resource-form";
import { ResourceTable } from "@/components/admin/resource-table";
import type { ResourceFormDef } from "@/config/admin-fields";

const PREVIEW_PATHS: Record<string, (values: Record<string, unknown>) => string | null> = {
  hero: () => "/",
  about: () => "/about",
  projects: (values) => (values.slug ? `/projects/${values.slug}` : "/projects"),
  blog: (values) => (values.slug ? `/blog/${values.slug}` : "/blog"),
  experience: () => "/experience",
  skills: () => "/skills",
  education: () => "/about",
  achievements: () => "/achievements",
  testimonials: () => "/",
  social: () => "/contact",
  resume: () => "/resume",
  seo: () => "/",
  settings: () => "/",
};

export function ResourceScreen({
  resource,
  def,
  id,
}: {
  resource: string;
  def: ResourceFormDef;
  id?: string;
}) {
  if (def.singleton || id) {
    return (
      <ResourceForm
        resource={resource}
        def={def}
        id={id}
        previewPath={PREVIEW_PATHS[resource]}
      />
    );
  }

  return <ResourceTable resource={resource} def={def} />;
}
