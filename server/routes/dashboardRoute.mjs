import { Router } from "express";
import {
  getDashboardStats,
  getAnalytics,
  getQuickStats,
} from "../controllers/dashboardController.mjs";
import adminAuth from "../middleware/adminAuth.js";

const router = Router();

const routeValue = "/api/dashboard/";

// Admin dashboard routes
router.get(`${routeValue}stats`, adminAuth, getDashboardStats);
router.get(`${routeValue}analytics`, adminAuth, getAnalytics);
router.get(`${routeValue}quick-stats`, adminAuth, getQuickStats);

export default router;
