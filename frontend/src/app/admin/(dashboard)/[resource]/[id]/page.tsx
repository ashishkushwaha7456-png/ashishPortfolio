import { notFound } from "next/navigation";
import { ResourceScreen } from "@/components/admin/resource-screen";
import { getFormDef } from "@/config/admin-fields";

export const dynamic = "force-dynamic";

/** Create (`/new`) and edit (`/:id`) share the same generated form. */
export default async function AdminResourceEditPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource, id } = await params;
  const def = getFormDef(resource);
  if (!def || def.singleton) notFound();

  return <ResourceScreen resource={resource} def={def} id={id} />;
}
