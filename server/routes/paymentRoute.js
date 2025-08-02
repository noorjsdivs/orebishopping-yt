import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
  createOrder,
} from "../controllers/paymentController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

const routeValue = "/api/payment/";

// Create order
router.post("/api/order/create", userAuth, createOrder);

// Stripe payment routes
router.post(
  `${routeValue}stripe/create-payment-intent`,
  userAuth,
  createPaymentIntent
);
router.post(`${routeValue}stripe/confirm-payment`, userAuth, confirmPayment);

// Stripe webhook (no auth required)
router.post(
  `${routeValue}stripe/webhook`,
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default router;
