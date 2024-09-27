import { Router } from "express";
import * as itemController from "../controllers/itemController.js";

const router = Router();

/**
 * @route   GET /api/items
 * @desc    Get all items or filter by category
 * @access  Public
 */
router.get("/", itemController.getItems);

/**
 * @route   GET /api/items/:id
 * @desc    Get a single item by ID
 * @access  Public
 */
router.get("/:id", itemController.getItemById);

/**
 * @route   POST /api/items
 * @desc    Create a new item
 * @access  Public (Should be protected in production)
 */
router.post("/", itemController.createItem);

/**
 * @route   PUT /api/items/:id
 * @desc    Update an existing item by ID
 * @access  Public (Should be protected in production)
 */
router.put("/:id", itemController.updateItem);

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete an item by ID
 * @access  Public (Should be protected in production)
 */
router.delete("/:id", itemController.deleteItem);

export default router;
