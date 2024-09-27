import { ICategory } from "../../../interfaces/ICategory.js";
import Category from "../models/categoryModel.js";

/**
 * Get all categories.
 */
export const getCategories = async (): Promise<ICategory[]> => {
  return Category.find().exec();
};

/**
 * Get a single category by ID.
 */
export const getCategoryById = async (
  id: string
): Promise<ICategory | null> => {
  return Category.findById(id).exec();
};

/**
 * Create a new category.
 */
export const createCategory = async (
  categoryData: ICategory
): Promise<ICategory> => {
  const newCategory = new Category(categoryData);
  return newCategory.save();
};

/**
 * Update an existing category by ID.
 */
export const updateCategory = async (
  id: string,
  categoryData: Partial<ICategory>
): Promise<ICategory | null> => {
  return Category.findByIdAndUpdate(id, categoryData, { new: true }).exec();
};

/**
 * Delete a category by ID.
 */
export const deleteCategory = async (id: string): Promise<ICategory | null> => {
  return Category.findByIdAndDelete(id).exec();
};
