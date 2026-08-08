import type { Request, Response } from "express";
import { z } from "zod";
import { connectDatabase } from "@/config/database";
import {
  applyDerivedFields,
  getResource,
  isResource,
  searchFilter,
} from "@/utils/crud";
import { paginationSchema } from "@/validators";
import { serialize } from "@/utils";
import { asyncHandler } from "@/utils/async-handler";
import { triggerRevalidation } from "./admin-ops.controller";


const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

const messagePatchSchema = z.object({
  read: z.boolean().optional(),
  starred: z.boolean().optional(),
  archived: z.boolean().optional(),
  replied: z.boolean().optional(),
});

async function revalidateResource(req: Request, config: any, resource: string, slug?: string) {
  const paths = [...config.revalidate];
  if (slug) {
    if (resource === "projects") paths.push(`/projects/${slug}`);
    if (resource === "blog") paths.push(`/blog/${slug}`);
  }
  await triggerRevalidation(req.headers.cookie, paths);
}

/** GET /api/admin/content/:resource — paginated list (or the singleton). */
export const getList = asyncHandler(async (req: Request, res: Response) => {
  const { resource } = req.params;
  if (!isResource(resource)) {
    return res.status(404).json({ success: false, error: `Unknown resource "${resource}"` });
  }

  const config = getResource(resource);
  const conn = await connectDatabase();
  if (!conn) {
    return res.status(503).json({ success: false, error: "Database not configured" });
  }

  if (config.singleton) {
    const doc = await config.model.findOne().lean();
    return res.json({ success: true, data: doc ? serialize(doc) : null });
  }

  const { page, limit, search, status, sort } = paginationSchema.parse(req.query);

  const filter: Record<string, unknown> = { ...searchFilter(config, search) };
  if (status && status !== "all") filter.status = status;

  const sortSpec = sort
    ? { [sort.replace(/^-/, "")]: sort.startsWith("-") ? -1 : 1 }
    : config.sort;

  const [items, total] = await Promise.all([
    config.model
      .find(filter)
      .sort(sortSpec as Record<string, 1 | -1>)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    config.model.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: serialize(items),
    meta: {
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

/** POST /api/admin/content/:resource — Creates or updates singletons. */
export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const { resource } = req.params;
  if (!isResource(resource)) {
    return res.status(404).json({ success: false, error: `Unknown resource "${resource}"` });
  }

  const config = getResource(resource);

  // Check roles rank
  if (req.user && !hasRoleRank(req.user.role, config.writeRole)) {
    return res.status(403).json({ success: false, error: "You do not have permission to do that" });
  }

  if (!config.schema) {
    return res.status(405).json({ success: false, error: `${config.label} cannot be created via the API` });
  }

  const conn = await connectDatabase();
  if (!conn) {
    return res.status(503).json({ success: false, error: "Database not configured" });
  }

  const data = config.schema.parse(req.body) as Record<string, unknown>;
  applyDerivedFields(resource, data);

  const doc = config.singleton
    ? await config.model.findOneAndUpdate({}, data, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      })
    : await config.model.create(data);

  // Revalidate frontend
  await revalidateResource(req, config, resource, data.slug as string);

  res.status(201).json({
    success: true,
    data: serialize(doc.toJSON()),
  });
});

/** GET /api/admin/content/:resource/:id */
export const getItem = asyncHandler(async (req: Request, res: Response) => {
  const { resource, id } = req.params;
  if (!isResource(resource)) {
    return res.status(404).json({ success: false, error: `Unknown resource "${resource}"` });
  }

  objectId.parse(id);
  const conn = await connectDatabase();
  if (!conn) {
    return res.status(503).json({ success: false, error: "Database not configured" });
  }

  const doc = await getResource(resource).model.findById(id).lean();
  if (!doc) {
    return res.status(404).json({ success: false, error: "Not found" });
  }

  res.json({
    success: true,
    data: serialize(doc),
  });
});

/** PATCH /api/admin/content/:resource/:id */
export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const { resource, id } = req.params;
  if (!isResource(resource)) {
    return res.status(404).json({ success: false, error: `Unknown resource "${resource}"` });
  }

  const config = getResource(resource);

  // Check roles rank
  if (req.user && !hasRoleRank(req.user.role, config.writeRole)) {
    return res.status(403).json({ success: false, error: "You do not have permission to do that" });
  }

  objectId.parse(id);
  const conn = await connectDatabase();
  if (!conn) {
    return res.status(503).json({ success: false, error: "Database not configured" });
  }

  const body = req.body;
  const data =
    resource === "messages"
      ? messagePatchSchema.parse(body)
      : ((config.schema as unknown as z.AnyZodObject).partial().parse(body) as Record<
          string,
          unknown
        >);

  applyDerivedFields(resource, data);

  const doc = await config.model.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return res.status(404).json({ success: false, error: "Not found" });
  }

  // Revalidate frontend
  const slug = (data as { slug?: string }).slug ?? (doc as { slug?: string }).slug;
  await revalidateResource(req, config, resource, slug);

  res.json({
    success: true,
    data: serialize(doc.toJSON()),
  });
});

/** DELETE /api/admin/content/:resource/:id */
export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const { resource, id } = req.params;
  if (!isResource(resource)) {
    return res.status(404).json({ success: false, error: `Unknown resource "${resource}"` });
  }

  const config = getResource(resource);

  // Check roles rank
  if (req.user && !hasRoleRank(req.user.role, config.writeRole)) {
    return res.status(403).json({ success: false, error: "You do not have permission to do that" });
  }

  objectId.parse(id);
  const conn = await connectDatabase();
  if (!conn) {
    return res.status(503).json({ success: false, error: "Database not configured" });
  }

  const doc = await config.model.findByIdAndDelete(id);
  if (!doc) {
    return res.status(404).json({ success: false, error: "Not found" });
  }

  // Revalidate frontend
  await revalidateResource(req, config, resource);

  res.json({
    success: true,
    data: { id, deleted: true },
  });
});

const ROLE_RANK: Record<string, number> = { viewer: 1, editor: 2, admin: 3 };
function hasRoleRank(userRole: string, requiredRole: string): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[requiredRole];
}
