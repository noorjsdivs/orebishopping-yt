import express from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getUserContacts,
} from "../controllers/contactController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

const routeValue = "/api/contact";

// User routes (require authentication)
router.post(`${routeValue}`, userAuth, createContact);
router.get(`${routeValue}/my-contacts`, userAuth, getUserContacts);

// Admin routes (require admin authentication)
router.get(`${routeValue}/admin/all`, adminAuth, getAllContacts);
router.get(`${routeValue}/admin/:id`, adminAuth, getContactById);
router.put(`${routeValue}/admin/:id/status`, adminAuth, updateContactStatus);
router.delete(`${routeValue}/admin/:id`, adminAuth, deleteContact);

export default router;
