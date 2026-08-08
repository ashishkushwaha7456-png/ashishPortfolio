import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { fail, handler, ok, parseBody } from "@/lib/api";
import { requireSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  paths: z.array(z.string().startsWith("/")).optional(),
  tags: z.array(z.string()).optional(),
  all: z.boolean().optional(),
});

const ALL_PATHS = [
  "/",
  "/about",
  "/experience",
  "/projects",
  "/skills",
  "/achievements",
  "/resume",
  "/blog",
  "/contact",
];

/**
 * POST /api/admin/revalidate
 * Forces the static cache to refresh without waiting for the ISR window —
 * the "publish now" button in the admin panel.
 */
export const POST = handler(async (request: Request) => {
  await requireSession("editor");

  const { paths, tags, all } = await parseBody(request, bodySchema);

  if (!paths?.length && !tags?.length && !all) {
    return fail("Provide paths, tags, or all: true", 400);
  }

  const revalidated: string[] = [];

  for (const path of all ? ALL_PATHS : (paths ?? [])) {
    revalidatePath(path);
    revalidated.push(path);
  }

  for (const tag of tags ?? []) {
    revalidateTag(tag);
    revalidated.push(`tag:${tag}`);
  }

  return ok({ revalidated, at: new Date().toISOString() });
});
