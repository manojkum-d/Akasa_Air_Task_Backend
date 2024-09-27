import { Request, Response, NextFunction } from "express";
import * as itemService from "../services/itemService.js";
import { IItem } from "../../../interfaces/IItem.js";

/**
 * Get all items or filter by category.
 */
export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category } = req.query; // Optional query parameter for filtering by category
    const items = await itemService.getItems(category as string);
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single item by ID.
 */
export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await itemService.getItemById(id);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json({ item });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new item.
 */
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const itemData: IItem = req.body;
    const newItem = await itemService.createItem(itemData);
    res
      .status(201)
      .json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing item by ID.
 */
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const itemData: Partial<IItem> = req.body;
    const updatedItem = await itemService.updateItem(id, itemData);
    if (!updatedItem) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an item by ID.
 */
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedItem = await itemService.deleteItem(id);
    if (!deletedItem) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json({ message: "Item deleted successfully", item: deletedItem });
  } catch (error) {
    next(error);
  }
};
