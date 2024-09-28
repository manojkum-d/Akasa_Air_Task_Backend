import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { authenticateToken } from "../../auth/middlewares/authMiddleware.js";

const router = Router();

/**
 * @route   GET /api/orders/user
 * @desc    Get all orders for the authenticated user
 * @access  Private
 */
router.get("/user", authenticateToken, orderController.getUserOrders);

/**
 * @route   GET /api/orders/:orderId
 * @desc    Get a specific order by ID
 * @access  Private
 */
router.get("/:orderId", authenticateToken, orderController.getOrder);

/**
 * @route   PATCH /api/orders/:orderId/status
 * @desc    Update the status of an order
 * @access  Private
 */
router.patch(
  "/:orderId/status",
  authenticateToken,
  orderController.updateOrderStatus
);

/**
 * @route   PATCH /api/orders/:orderId/payment
 * @desc    Update the payment status of an order
 * @access  Private
 */
router.patch(
  "/:orderId/payment",
  authenticateToken,
  orderController.updatePaymentStatus
);

/**
 * @route   GET /api/orders/tracking/:trackingId
 * @desc    Get an order by its tracking ID
 * @access  Private
 */
router.get(
  "/tracking/:trackingId",
  authenticateToken,
  orderController.getOrderByTracking
);

/**
 * @route   POST /api/orders/checkout
 * @desc    Checkout the current cart and create a new order
 * @access  Private
 */
router.post("/checkout", authenticateToken, orderController.checkout);

export default router;
