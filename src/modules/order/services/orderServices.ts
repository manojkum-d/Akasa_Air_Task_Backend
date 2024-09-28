import Order from "../models/orderModel.js";
import { Types } from "mongoose";
import { IOrder } from "../../../interfaces/IOrder.js";
import * as cartService from "../../cart/services/cartServices.js"; // Import cart service
import { redisClient } from "../../../config/redis.js"; // Import Redis client
import Item from "../../item/models/itemModel.js"; // Import Item model

/**
 * Get order history for a specific user.
 */
export const getOrderHistory = async (
  userId: Types.ObjectId
): Promise<IOrder[]> => {
  const cacheKey = `orders:user:${userId.toString()}`;

  // Check if order history is cached in Redis
  const cachedOrders = await redisClient.get(cacheKey);
  if (cachedOrders) {
    console.log(`Serving order history from cache: ${cacheKey}`);
    return JSON.parse(cachedOrders); // Return cached data
  }

  // If not cached, fetch from MongoDB and populate items
  const orders = await Order.find({ user: userId })
    .populate("items.item")
    .exec();

  // Store the result in Redis for 10 minutes
  await redisClient.set(cacheKey, JSON.stringify(orders), { EX: 600 });

  return orders;
};

/**
 * Checkout process: Create an order based on the user's cart.
 */
export const checkout = async (userId: Types.ObjectId): Promise<IOrder> => {
  // Call the cart service to perform checkout
  const order = await cartService.checkout(userId);

  // Deduct the quantities from the items in stock
  for (const orderItem of order.items) {
    const item = await Item.findById(orderItem.item);

    if (item) {
      item.stockQuantity -= orderItem.quantity; // Deduct the quantity from stock
      await item.save(); // Save the updated item
    }
  }

  // Invalidate the cache for the user's order history
  await redisClient.del(`orders:user:${userId.toString()}`); // Clear cached orders for the user

  return order; // Return the newly created order
};

/**
 * Get an order by ID.
 */
export const getOrderById = async (id: string): Promise<IOrder | null> => {
  const cacheKey = `order:${id}`;

  // Check if order is cached in Redis
  const cachedOrder = await redisClient.get(cacheKey);
  if (cachedOrder) {
    console.log(`Serving order from cache: ${cacheKey}`);
    return JSON.parse(cachedOrder); // Return cached data
  }

  // If not cached, fetch from MongoDB and populate items
  const order = await Order.findById(id).populate("items.item").exec();

  if (order) {
    // Store the result in Redis for 10 minutes
    await redisClient.set(cacheKey, JSON.stringify(order), { EX: 600 });
  }

  return order;
};

/**
 * Update an existing order by ID.
 */
export const updateOrder = async (
  id: string,
  orderData: Partial<IOrder>
): Promise<IOrder | null> => {
  const updatedOrder = await Order.findByIdAndUpdate(id, orderData, {
    new: true,
  })
    .lean()
    .populate("items.item")
    .exec();

  if (updatedOrder) {
    // Invalidate relevant cache entries after updating the order
    await redisClient.del(`order:${id}`); // Clear cache for the updated order
    await redisClient.del(`orders:user:${updatedOrder.user.toString()}`); // Clear cache for the user's orders
  }

  return updatedOrder;
};

/**
 * Delete an order by ID.
 */
export const deleteOrder = async (id: string): Promise<IOrder | null> => {
  const deletedOrder = await Order.findByIdAndDelete(id)
    .lean()
    .populate("items.item")
    .exec();

  if (deletedOrder) {
    // Invalidate relevant cache entries after deleting the order
    await redisClient.del(`order:${id}`); // Clear cache for the deleted order
    await redisClient.del(`orders:user:${deletedOrder.user.toString()}`); // Clear cache for the user's orders
  }

  return deletedOrder;
};
