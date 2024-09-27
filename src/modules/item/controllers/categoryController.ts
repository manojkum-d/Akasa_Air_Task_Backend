import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/categoryService.js";
import { ICategory } from "../../../interfaces/ICategory.js";

/**
 * Get all categories
 */
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await categoryService.getCategories();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single category by ID
 */
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({ category });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new category
 */
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categoryData: ICategory = req.body;
    const newCategory = await categoryService.createCategory(categoryData);
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing category by ID
 */
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const categoryData: Partial<ICategory> = req.body;
    const updatedCategory = await categoryService.updateCategory(
      id,
      categoryData
    );
    if (!updatedCategory) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a category by ID
 */
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryService.deleteCategory(id);
    if (!deletedCategory) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    next(error);
  }
};
