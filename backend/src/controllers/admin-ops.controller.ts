import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { connectDatabase } from "@/config/database";
import { getS3Client, getS3Bucket, s3PublicUrl, isS3Configured } from "@/config/s3";
import {
  AboutModel,
  AchievementModel,
  BlogModel,
  EducationModel,
  ExperienceModel,
  HeroModel,
  ProjectModel,
  ResumeModel,
  SEOModel,
  SettingsModel,
  SkillModel,
  SocialModel,
  TestimonialModel,
  UserModel,
} from "@/models";
import {
  ABOUT_SEED,
  ACHIEVEMENTS_SEED,
  BLOG_SEED,
  EDUCATION_SEED,
  EXPERIENCE_SEED,
  HERO_SEED,
  PROJECTS_SEED,
  SKILLS_SEED,
  SOCIAL_SEED,
  TESTIMONIALS_SEED,
} from "@/constants/seed-data";
import { DEFAULT_SEO, DEFAULT_SETTINGS, PERSON } from "@/constants/site";
import { asyncHandler } from "@/utils/async-handler";

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
];

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

/** Forward revalidation paths/tags to the Next.js frontend server */
export async function triggerRevalidation(
  reqCookieHeader: string | undefined,
  paths: string[] = [],
  tags: string[] = [],
  all = false
) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${frontendUrl}/api/admin/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": reqCookieHeader || "",
      },
      body: JSON.stringify({ paths, tags, all }),
    });
    if (!res.ok) {
      console.error("[revalidate] frontend revalidate request failed:", res.statusText);
    }
  } catch (error) {
    console.error("[revalidate] failed to contact frontend for revalidation:", (error as Error).message);
  }
}

/** POST /api/admin/revalidate */
export const revalidate = asyncHandler(async (req: Request, res: Response) => {
  const { paths, tags, all } = req.body;

  if (!paths?.length && !tags?.length && !all) {
    return res.status(400).json({
      success: false,
      error: "Provide paths, tags, or all: true",
    });
  }

  // Delegate directly to the frontend's revalidate route
  await triggerRevalidation(req.headers.cookie, paths, tags, all);

  res.json({
    success: true,
    data: {
      revalidated: all ? ALL_PATHS : (paths ?? []),
      tags: tags ?? [],
      at: new Date().toISOString(),
    },
  });
});

/** POST /api/admin/seed */
export const seed = asyncHandler(async (req: Request, res: Response) => {
  const conn = await connectDatabase();
  if (!conn) {
    return res.status(503).json({
      success: false,
      error: "Database not configured — set MONGODB_URI",
    });
  }

  const counts: Record<string, number> = {};

  /* ── Singletons ─────────────────────────────────────────── */
  await HeroModel.findOneAndUpdate({}, HERO_SEED, { upsert: true, setDefaultsOnInsert: true });
  await AboutModel.findOneAndUpdate({}, ABOUT_SEED, { upsert: true, setDefaultsOnInsert: true });
  await SEOModel.findOneAndUpdate({}, DEFAULT_SEO, { upsert: true, setDefaultsOnInsert: true });
  await SettingsModel.findOneAndUpdate({}, DEFAULT_SETTINGS, {
    upsert: true,
    setDefaultsOnInsert: true,
  });
  counts.singletons = 4;

  /* ── Collections ────────────────── */
  const upsertMany = async <T extends object>(
    model: any,
    docs: T[],
    key: keyof T & string
  ) => {
    await Promise.all(
      docs.map((doc) =>
        model.findOneAndUpdate({ [key]: doc[key] }, doc, {
          upsert: true,
          setDefaultsOnInsert: true,
        })
      )
    );
    return docs.length;
  };

  counts.projects = await upsertMany(ProjectModel, PROJECTS_SEED, "slug");
  counts.experience = await upsertMany(ExperienceModel, EXPERIENCE_SEED, "company");
  counts.skills = await upsertMany(SkillModel, SKILLS_SEED, "name");
  counts.education = await upsertMany(EducationModel, EDUCATION_SEED, "institution");
  counts.achievements = await upsertMany(AchievementModel, ACHIEVEMENTS_SEED, "title");
  counts.testimonials = await upsertMany(TestimonialModel, TESTIMONIALS_SEED, "name");
  counts.blog = await upsertMany(BlogModel, BLOG_SEED, "slug");
  counts.social = await upsertMany(SocialModel, SOCIAL_SEED, "platform");

  await ResumeModel.findOneAndUpdate(
    { isActive: true },
    {
      label: `${PERSON.name} — Resume`,
      fileUrl: "/resume/Ashish-Kumar-Resume.pdf",
      version: "2026.1",
      updatedOn: "2026-01-15",
      isActive: true,
    },
    { upsert: true, setDefaultsOnInsert: true }
  );
  counts.resume = 1;

  /* ── Admin user ─────────────────────────────────────────── */
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existing = await UserModel.findOne({ email: adminEmail });
    if (!existing) {
      await UserModel.create({
        name: PERSON.name,
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        role: "admin",
        active: true,
      });
      counts.users = 1;
    } else {
      counts.users = 0;
    }
  }

  // Trigger frontend revalidation
  await triggerRevalidation(req.headers.cookie, ALL_PATHS, [], false);

  res.json({
    success: true,
    data: { seeded: true, counts },
  });
});

/** POST /api/admin/upload */
export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  const s3 = getS3Client();
  if (!s3) {
    return res.status(503).json({
      success: false,
      error: "AWS S3 is not configured. Add AWS_* variables in .env.",
    });
  }

  const file = req.file;
  const folder = String(req.body.folder ?? "portfolio");

  if (!file) {
    return res.status(400).json({ success: false, error: "No file provided" });
  }
  if (file.size > MAX_BYTES) {
    return res.status(413).json({ success: false, error: "File is larger than 12MB" });
  }
  if (!ALLOWED.includes(file.mimetype)) {
    return res.status(415).json({ success: false, error: `Unsupported file type: ${file.mimetype}` });
  }

  // Generate a unique S3 key: folder/timestamp-originalname
  const sanitizedName = (file.originalname || "upload").replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `ashish-portfolio/${folder}/${Date.now()}-${sanitizedName}`;
  const ext = sanitizedName.split(".").pop() ?? "";

  await s3.send(
    new PutObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  const isVideo = file.mimetype.startsWith("video/");

  res.json({
    success: true,
    data: {
      url: s3PublicUrl(key),
      publicId: key,
      width: undefined,
      height: undefined,
      type: isVideo ? "video" : "image",
      format: ext,
      bytes: file.size,
    },
  });
});

/** DELETE /api/admin/upload */
export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const s3 = getS3Client();
  if (!s3) {
    return res.status(503).json({
      success: false,
      error: "AWS S3 is not configured.",
    });
  }

  const publicId = req.query.publicId as string;
  if (!publicId) {
    return res.status(400).json({ success: false, error: "publicId is required" });
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: getS3Bucket(),
      Key: publicId,
    })
  );

  res.json({
    success: true,
    data: { publicId, deleted: true },
  });
});
