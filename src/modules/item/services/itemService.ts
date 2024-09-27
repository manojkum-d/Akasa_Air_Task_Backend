import { IItem } from "../../../interfaces/IItem.js";
import Item from "../models/itemModel.js";

/**
 * Get all items or filter by category.
 */
export const getItems = async (category?: string): Promise<IItem[]> => {
  const query = category ? { category } : {};
  return Item.find(query).populate("category").exec();
};

/**
 * Get a single item by ID.
 */
export const getItemById = async (id: string): Promise<IItem | null> => {
  return Item.findById(id).populate("category").exec();
};

/**
 * Create a new item.
 */
export const createItem = async (itemData: IItem): Promise<IItem> => {
  const newItem = new Item(itemData);
  return newItem.save();
};

/**
 * Update an existing item by ID.
 */
export const updateItem = async (
  id: string,
  itemData: Partial<IItem>
): Promise<IItem | null> => {
  return Item.findByIdAndUpdate(id, itemData, { new: true })
    .populate("category")
    .exec();
};

/**
 * Delete an item by ID.
 */
export const deleteItem = async (id: string): Promise<IItem | null> => {
  return Item.findByIdAndDelete(id).populate("category").exec();
};
