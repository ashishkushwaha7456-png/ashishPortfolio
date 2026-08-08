import { Router } from "express";
import contentRoutes from "./content.routes";
import adminRoutes from "./admin.routes";
import * as contactController from "@/controllers/contact.controller";
import * as analyticsController from "@/controllers/analytics.controller";
import * as integrationsController from "@/controllers/integrations.controller";

const router = Router();

// Public Content endpoints
router.use("/content", contentRoutes);

// General Public endpoints
router.post("/contact", contactController.handleContact);
router.post("/analytics", analyticsController.trackEvent);

// Integrations
router.get("/spotify", integrationsController.getSpotifyNowPlaying);
router.get("/leetcode", integrationsController.getLeetCodeStats);

// Admin dashboard routes
router.use("/admin", adminRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ success: true, status: "ok", time: new Date() });
});

export default router;
