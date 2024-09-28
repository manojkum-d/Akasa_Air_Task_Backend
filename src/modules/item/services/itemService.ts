import { IItem } from "../../../interfaces/IItem.js";
import Item from "../models/itemModel.js";
import { redisClient } from "../../../config/redis.js";

/**
 * Get all items or filter by category with caching.
 */
export const getItems = async (category?: string): Promise<IItem[]> => {
  const cacheKey = category ? `items:category:${category}` : `items:all`;

  // Check if items are cached in Redis
  const cachedItems = await redisClient.get(cacheKey);
  if (cachedItems) {
    console.log(`Serving items from cache: ${cacheKey}`);
    return JSON.parse(cachedItems); // Return cached data
  }

  // If not cached, fetch from MongoDB using lean() to return plain JS objects
  const query = category ? { category } : {};
  const items = await Item.find(query).lean().populate("category").exec();

  // Store the result in Redis for 10 minutes
  await redisClient.set(cacheKey, JSON.stringify(items), { EX: 600 }); // EX: expiration time in seconds (600 = 10 minutes)

  return items;
};

/**
 * Get a single item by ID with caching.
 */
export const getItemById = async (id: string): Promise<IItem | null> => {
  const cacheKey = `item:${id}`;

  // Check if item is cached in Redis
  const cachedItem = await redisClient.get(cacheKey);
  if (cachedItem) {
    console.log(`Serving item from cache: ${cacheKey}`);
    return JSON.parse(cachedItem); // Return cached data
  }

  // If not cached, fetch from MongoDB using lean() to return plain JS objects
  const item = await Item.findById(id).lean().populate("category").exec();

  if (item) {
    // Store the result in Redis for 10 minutes
    await redisClient.set(cacheKey, JSON.stringify(item), { EX: 600 });
  }

  return item;
};

/**
 * Create a new item and invalidate the cache.
 */
export const createItem = async (itemData: IItem): Promise<IItem> => {
  const newItem = new Item(itemData);
  const savedItem = await newItem.save();

  // Invalidate relevant cache entries after creating a new item
  await redisClient.del("items:all"); // Clear cache for all items
  if (itemData.category) {
    await redisClient.del(`items:category:${itemData.category}`); // Clear cache for the item's category
  }

  return savedItem.toObject(); // Convert Mongoose document to plain JS object
};

/**
 * Update an existing item by ID and invalidate the cache.
 */
export const updateItem = async (
  id: string,
  itemData: Partial<IItem>
): Promise<IItem | null> => {
  const updatedItem = await Item.findByIdAndUpdate(id, itemData, { new: true })
    .lean()
    .populate("category")
    .exec();

  if (updatedItem) {
    // Invalidate relevant cache entries after updating the item
    await redisClient.del(`item:${id}`); // Clear cache for the updated item
    await redisClient.del("items:all"); // Clear cache for all items
    if (updatedItem.category) {
      await redisClient.del(`items:category:${updatedItem.category}`); // Clear cache for the item's category
    }
  }

  return updatedItem;
};

/**
 * Delete an item by ID and invalidate the cache.
 */
export const deleteItem = async (id: string): Promise<IItem | null> => {
  const deletedItem = await Item.findByIdAndDelete(id)
    .lean()
    .populate("category")
    .exec();

  if (deletedItem) {
    // Invalidate relevant cache entries after deleting the item
    await redisClient.del(`item:${id}`); // Clear cache for the deleted item
    await redisClient.del("items:all"); // Clear cache for all items
    if (deletedItem.category) {
      await redisClient.del(`items:category:${deletedItem.category}`); // Clear cache for the item's category
    }
  }

  return deletedItem;
};
