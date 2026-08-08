import { Router } from "express";
import multer from "multer";
import authRoutes from "./auth.routes";
import * as adminCrudController from "@/controllers/admin-crud.controller";
import * as adminOpsController from "@/controllers/admin-ops.controller";
import * as analyticsController from "@/controllers/analytics.controller";
import { requireRole } from "@/middlewares/auth.middleware";

const router = Router();
const upload = multer({ limits: { fileSize: 12 * 1024 * 1024 } }); // 12MB limit

// Auth routes mounted at /admin/auth
router.use("/auth", authRoutes);

// Analytics summary
router.get("/analytics", requireRole("viewer"), analyticsController.getSummary);

// Operations
router.post("/revalidate", requireRole("editor"), adminOpsController.revalidate);
router.post("/seed", requireRole("admin"), adminOpsController.seed);

// Uploads
router.post("/upload", requireRole("editor"), upload.single("file"), adminOpsController.uploadFile);
router.delete("/upload", requireRole("editor"), adminOpsController.deleteFile);

// Dynamic Content CRUD
router.get("/content/:resource", requireRole("viewer"), adminCrudController.getList);
router.post("/content/:resource", requireRole("viewer"), adminCrudController.createItem);
router.get("/content/:resource/:id", requireRole("viewer"), adminCrudController.getItem);
router.patch("/content/:resource/:id", requireRole("viewer"), adminCrudController.updateItem);
router.delete("/content/:resource/:id", requireRole("viewer"), adminCrudController.deleteItem);

export default router;
