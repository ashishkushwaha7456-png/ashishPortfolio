import { Router } from "express";
import * as contentController from "@/controllers/content.controller";
import { parseOptionalSession } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/hero", contentController.getHero);
router.get("/about", contentController.getAbout);
router.get("/projects", parseOptionalSession, contentController.getProjects);
router.get("/projects/:slug", contentController.getProjectBySlug);
router.get("/experience", contentController.getExperience);
router.get("/skills", contentController.getSkills);
router.get("/education", contentController.getEducation);
router.get("/achievements", contentController.getAchievements);
router.get("/testimonials", contentController.getTestimonials);
router.get("/blog", contentController.getPosts);
router.get("/blog/:slug", contentController.getPostBySlug);
router.get("/social", contentController.getSocialLinks);
router.get("/resume", contentController.getResume);
router.get("/seo", contentController.getSEO);
router.get("/settings", contentController.getSettings);

export default router;
