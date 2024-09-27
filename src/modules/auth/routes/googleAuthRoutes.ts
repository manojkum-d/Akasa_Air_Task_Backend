import { Router } from "express";
import {
  googleLogin,
  googleAuthCallback,
  getGoogleUserProfile,
} from "../controllers/googleAuthController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @route   GET /api/auth/google
 * @desc    Redirect to Google login
 * @access  Public
 */
router.get("/google", googleLogin);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get("/google/callback", googleAuthCallback);

/**
 * @route   GET /api/auth/google/profile
 * @desc    Get the Google authenticated user's profile
 * @access  Private
 */
router.get("/google/profile", authenticateToken, getGoogleUserProfile);

export default router;
