import Cart from "../models/cartModel.js";
import Item from "../../item/models/itemModel.js";
import Order from "../../order/models/orderModel.js"; // Import the Order model
import { Types } from "mongoose";
import { ICart } from "../../../interfaces/ICart.js";
import { nanoid } from "nanoid"; // For generating unique tracking IDs
import { IOrder } from "../../../interfaces/IOrder.js";

/**
 * Get the cart for a specific user by userId.
 */
export const getCartByUserId = async (
  userId: Types.ObjectId
): Promise<ICart | null> => {
  return Cart.findOne({ user: userId }).populate("items.item").exec();
};

/**
 * Add an item to the user's cart.
 */
export const addItemToCart = async (
  userId: Types.ObjectId,
  itemId: Types.ObjectId,
  quantity: number
): Promise<ICart> => {
  const item = await Item.findById(itemId);

  if (!item) {
    throw new Error("Item not found");
  }

  if (quantity > item.stockQuantity) {
    throw new Error(
      `Requested quantity (${quantity}) exceeds available stock (${item.stockQuantity})`
    );
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [{ item: itemId, quantity }] });
  } else {
    const itemIndex = cart.items.findIndex(
      (cartItem) => cartItem.item.toString() === itemId.toString()
    );

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;

      if (newQuantity > item.stockQuantity) {
        throw new Error(
          `Total quantity (${newQuantity}) exceeds available stock (${item.stockQuantity})`
        );
      }

      cart.items[itemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ item: itemId, quantity });
    }
  }

  return cart.save();
};

/**
 * Remove an item from the user's cart.
 */
export const removeItemFromCart = async (
  userId: Types.ObjectId,
  itemId: Types.ObjectId
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: userId });

  if (cart) {
    cart.items = cart.items.filter(
      (item) => item.item.toString() !== itemId.toString()
    );
    return cart.save();
  }

  return null;
};

/**
 * Clear the user's cart.
 */
export const clearCart = async (userId: Types.ObjectId): Promise<void> => {
  await Cart.findOneAndDelete({ user: userId });
};

/**
 * Validate stock before checkout.
 */
export const validateStock = async (userId: Types.ObjectId): Promise<void> => {
  const cart = await getCartByUserId(userId);

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  for (const cartItem of cart.items) {
    const item = await Item.findById(cartItem.item);

    if (!item) {
      throw new Error(`Item with ID ${cartItem.item} not found`);
    }

    if (cartItem.quantity > item.stockQuantity) {
      throw new Error(
        `Requested quantity for item ${item.name} exceeds available stock`
      );
    }
  }
};

/**
 * Checkout process: Deduct stock, create an order, and clear the cart.
 */
export const checkout = async (userId: Types.ObjectId): Promise<IOrder> => {
  const cart = await getCartByUserId(userId);
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  await validateStock(userId); // Ensure the stock is available

  const orderItems = [];
  let totalAmount = 0; // Initialize totalAmount to zero

  // Loop through cart items and calculate total amount while deducting stock
  for (const cartItem of cart.items) {
    const item = await Item.findById(cartItem.item);
    if (item) {
      item.stockQuantity -= cartItem.quantity; // Deduct stock quantity
      await item.save(); // Save updated stock

      orderItems.push({ item: item._id, quantity: cartItem.quantity });
      totalAmount += item.price * cartItem.quantity; // Calculate totalAmount
    }
  }

  // Generate a unique tracking ID for the order
  const trackingId = nanoid(12);

  // Create the order with items, totalAmount, and trackingId
  const newOrder = new Order({
    user: userId,
    items: orderItems,
    totalAmount,
    trackingId, // Assign unique tracking ID
    orderStatus: "Processing", // Set initial order status
    paymentStatus: "Paid", // Assuming payment is successful
  });

  await newOrder.save(); // Save the order

  await clearCart(userId); // Clear the cart after successful checkout

  return newOrder; // Return the newly created order
};
