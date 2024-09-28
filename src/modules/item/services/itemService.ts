import { IItem } from "../../../interfaces/IItem.js";
import Item from "../models/itemModel.js";

/**
 * Get all items or filter by category.
 */
export const getItems = async (category?: string): Promise<IItem[]> => {
  // Query to find items, either by category or all items
  const query = category ? { category } : {};
  const items = await Item.find(query).lean().populate("category").exec();

  return items; // Return the found items
};

/**
 * Get a single item by ID.
 */
export const getItemById = async (id: string): Promise<IItem | null> => {
  // Fetch item by ID and populate the category
  const item = await Item.findById(id).lean().populate("category").exec();

  return item; // Return the found item or null if not found
};

/**
 * Create a new item.
 */
export const createItem = async (itemData: IItem): Promise<IItem> => {
  const newItem = new Item(itemData);
  const savedItem = await newItem.save();

  return savedItem.toObject(); // Convert Mongoose document to plain JS object
};

/**
 * Update an existing item by ID.
 */
export const updateItem = async (
  id: string,
  itemData: Partial<IItem>
): Promise<IItem | null> => {
  const updatedItem = await Item.findByIdAndUpdate(id, itemData, { new: true })
    .lean()
    .populate("category")
    .exec();

  return updatedItem; // Return the updated item or null if not found
};

/**
 * Delete an item by ID.
 */
export const deleteItem = async (id: string): Promise<IItem | null> => {
  const deletedItem = await Item.findByIdAndDelete(id)
    .lean()
    .populate("category")
    .exec();

  return deletedItem; // Return the deleted item or null if not found
};
