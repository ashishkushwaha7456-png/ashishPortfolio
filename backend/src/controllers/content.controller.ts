import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/async-handler";
import * as contentService from "@/services/content.service";
import { hasRole } from "@/middlewares/auth.middleware";

export const getHero = asyncHandler(async (req: Request, res: Response) => {
  const data = await contentService.getHero();
  res.json({ success: true, data });
});

export const getAbout = asyncHandler(async (req: Request, res: Response) => {
  const data = await contentService.getAbout();
  res.json({ success: true, data });
});

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const featured = req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  
  // Only editors/admins can preview drafts
  const includeDrafts = req.query.includeDrafts === "true" && req.user && hasRole(req.user.role, "editor");

  const data = await contentService.getProjects({ featured, limit, includeDrafts });
  res.json({ success: true, data });
});

export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = await contentService.getProjectBySlug(slug);
  if (!data) {
    return res.status(404).json({ success: false, error: "Project not found" });
  }
  res.json({ success: true, data });
});

export const getExperience = asyncHandler(async (req: Request, res: Response) => {
  const data = await contentService.getExperience();
  res.json({ success: true, data });
});

export const getSkills = asyncHandler(async (req: Request, res: Response) => {
  const featured = req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined;
  const data = await contentService.getSkills({ featured });
  res.json({ success: true, data });
});

export const getEducation = asyncHandler(async (req: Request, res: Response) => {
  const data = await contentService.getEducation();
  res.json({ success: true, data });
});

export const getAchievements = asyncHandler(async (req: Request, res: Response) => {
  const data = await contentService.getAchievements();
  res.json({ success: true, data });
});

export const getTestimonials = asyncHandler(async (req: Request, res: Response) => {
  const featured = req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined;
  const data = await contentService.getTestimonials({ featured });
  res.json({ success: true, data });
});

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const featured = req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const category = req.query.category ? String(req.query.category) : undefined;
  const tag = req.query.tag ? String(req.query.tag) : undefined;

  const data = await contentService.getPosts({ featured, limit, category, tag });
  res.json({ success: true, data });
});

export const getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const data = await contentService.getPostBySlug(slug);
  if (!data) {
    return res.status(404).json({ success: false, error: "Blog post not found" });
  }
  res.json({ success: true, data });
});

export const getSocialLinks = asyncHandler(async (req: Request, res: Response) => {
  const data = await contentService.getSocialLinks();
  res.json({ success: true, data });
});

export const getResume = asyncHandler(async (req: Request, res: Response) => {
  const data = await contentService.getResume();
  res.json({ success: true, data });
});

export const getSEO = asyncHandler(async (req: Request, res: Response) => {
  const data = await contentService.getSEO();
  res.json({ success: true, data });
});

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const data = await contentService.getSettings();
  res.json({ success: true, data });
});
