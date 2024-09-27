import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";

const router = Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get("/", categoryController.getCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get a single category by ID
 * @access  Public
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Public (Should be protected in production)
 */
router.post("/", categoryController.createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update an existing category by ID
 * @access  Public (Should be protected in production)
 */
router.put("/:id", categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category by ID
 * @access  Public (Should be protected in production)
 */
router.delete("/:id", categoryController.deleteCategory);

export default router;
