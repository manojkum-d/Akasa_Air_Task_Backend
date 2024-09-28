import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../../modules/item/services/itemService.js";
import Item from "../../modules/item/models/itemModel.js";
import { redisClient } from "../../config/redis.js";
import { IItem } from "../../interfaces/IItem.js";
import { Types } from "mongoose";

// Mock the Redis client and MongoDB model
jest.mock("../../config/redis.js");
jest.mock("../../modules/item/models/itemModel.js");

describe("Item Service with Redis Integration", () => {
  // Define a plain JS object without Mongoose-specific properties
  const sampleItem = {
    _id: new Types.ObjectId("66f6f45884c74f63b2b8c010"),
    name: "Apple",
    category: new Types.ObjectId("66f6ee91c17bba6149d7e699"),
    price: 200,
    stockQuantity: 100,
    description: "Fresh apples",
    images: ["https://example.com/apple.png"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should fetch items from cache if available", async () => {
    // Mock Redis to return a cached value
    (redisClient.get as jest.Mock).mockResolvedValue(
      JSON.stringify([sampleItem])
    );

    const items = await getItems();
    expect(items).toEqual([sampleItem]);
    expect(redisClient.get).toHaveBeenCalledWith("items:all"); // Check if Redis get was called with the correct key
  });

  it("should fetch items from MongoDB and cache it if not in Redis", async () => {
    // Mock Redis to return null (cache miss)
    (redisClient.get as jest.Mock).mockResolvedValue(null);
    (Item.find as jest.Mock).mockResolvedValue([sampleItem]);

    const items = await getItems();
    expect(items).toEqual([sampleItem]);
    expect(Item.find).toHaveBeenCalled(); // Check if MongoDB find was called
    expect(redisClient.set).toHaveBeenCalledWith(
      "items:all",
      JSON.stringify([sampleItem]),
      { EX: 600 }
    ); // Check if Redis set was called with the correct key and value
  });

  it("should fetch item by ID from cache if available", async () => {
    (redisClient.get as jest.Mock).mockResolvedValue(
      JSON.stringify(sampleItem)
    );

    const item = await getItemById(sampleItem._id.toString());
    expect(item).toEqual(sampleItem);
    expect(redisClient.get).toHaveBeenCalledWith(`item:${sampleItem._id}`); // Check if Redis get was called with the correct key
  });

  it("should create a new item and invalidate cache", async () => {
    (Item.prototype.save as jest.Mock).mockResolvedValue(sampleItem);

    const newItem = await createItem(sampleItem as IItem); // Cast sampleItem to IItem
    expect(newItem).toEqual(sampleItem);
    expect(redisClient.del).toHaveBeenCalledWith("items:all"); // Check if Redis cache for items:all was invalidated
  });

  it("should update an existing item and invalidate cache", async () => {
    (Item.findByIdAndUpdate as jest.Mock).mockResolvedValue(sampleItem);

    const updatedItem = await updateItem(sampleItem._id.toString(), {
      name: "Green Apple",
    });
    expect(updatedItem).toEqual(sampleItem);
    expect(redisClient.del).toHaveBeenCalledWith(`item:${sampleItem._id}`); // Check if Redis cache for item was invalidated
    expect(redisClient.del).toHaveBeenCalledWith("items:all"); // Check if Redis cache for items:all was invalidated
  });

  it("should delete an existing item and invalidate cache", async () => {
    (Item.findByIdAndDelete as jest.Mock).mockResolvedValue(sampleItem);

    const deletedItem = await deleteItem(sampleItem._id.toString());
    expect(deletedItem).toEqual(sampleItem);
    expect(redisClient.del).toHaveBeenCalledWith(`item:${sampleItem._id}`); // Check if Redis cache for item was invalidated
    expect(redisClient.del).toHaveBeenCalledWith("items:all"); // Check if Redis cache for items:all was invalidated
  });
});
