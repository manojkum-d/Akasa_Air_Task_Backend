import { Router } from "express";
import * as cartController from "../controllers/cartController.js";
import { authenticateToken } from "../../auth/middlewares/authMiddleware.js"; // Import the auth middleware

const router = Router();

/**
 * @route   GET /api/cart
 * @desc    Get the user's cart
 * @access  Private
 */
router.get("/", authenticateToken, cartController.getCart);

/**
 * @route   POST /api/cart/add
 * @desc    Add an item to the cart
 * @access  Private
 */
router.post("/add", authenticateToken, cartController.addItemToCart);

/**
 * @route   POST /api/cart/remove
 * @desc    Remove an item from the cart
 * @access  Private
 */
router.post("/remove", authenticateToken, cartController.removeItemFromCart);

/**
 * @route   POST /api/cart/clear
 * @desc    Clear the user's cart
 * @access  Private
 */
router.post("/clear", authenticateToken, cartController.clearCart);

export default router;
