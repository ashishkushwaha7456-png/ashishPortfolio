import { notFound } from "next/navigation";
import { ResourceScreen } from "@/components/admin/resource-screen";
import { getFormDef } from "@/config/admin-fields";

export const dynamic = "force-dynamic";

/**
 * One route serves every content type. Singletons render their form directly;
 * collections render a searchable table.
 */
export default async function AdminResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  const def = getFormDef(resource);
  if (!def) notFound();

  return <ResourceScreen resource={resource} def={def} />;
}
