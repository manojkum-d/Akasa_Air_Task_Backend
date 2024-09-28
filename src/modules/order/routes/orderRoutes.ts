import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { authenticateToken } from "../../auth/middlewares/authMiddleware.js"; // Import the auth middleware

const router = Router();

/**
 * @route   GET /api/orders
 * @desc    Get order history for the user
 * @access  Private
 */
router.get("/", authenticateToken, orderController.getOrderHistory);

/**
 * @route   POST /api/orders/checkout
 * @desc    Checkout and place an order
 * @access  Private
 */
router.post("/checkout", authenticateToken, orderController.checkout);

/**
 * @route   GET /api/orders/:id
 * @desc    Get a specific order by ID
 * @access  Private
 */
router.get("/:id", authenticateToken, orderController.getOrderById);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update an existing order by ID
 * @access  Private
 */
router.put("/:id", authenticateToken, orderController.updateOrder);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete an order by ID
 * @access  Private
 */
router.delete("/:id", authenticateToken, orderController.deleteOrder);

export default router;
