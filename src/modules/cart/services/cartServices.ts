import Cart from "../models/cartModel.js";
import Item from "../../item/models/itemModel.js";
import { Types } from "mongoose";
import { ICart } from "../../../interfaces/ICart.js";

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
  // Fetch the item to check stock availability
  const item = await Item.findById(itemId);

  if (!item) {
    throw new Error("Item not found");
  }

  // Check if the requested quantity exceeds the available stock
  if (quantity > item.stockQuantity) {
    throw new Error(
      `Requested quantity (${quantity}) exceeds available stock (${item.stockQuantity})`
    );
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // Create a new cart for the user if it doesn't exist
    cart = new Cart({ user: userId, items: [{ item: itemId, quantity }] });
  } else {
    // Check if the item already exists in the cart
    const itemIndex = cart.items.findIndex(
      (cartItem) => cartItem.item.toString() === itemId.toString()
    );

    if (itemIndex > -1) {
      // Calculate the new total quantity
      const newQuantity = cart.items[itemIndex].quantity + quantity;

      // Check if the new total quantity exceeds the available stock
      if (newQuantity > item.stockQuantity) {
        throw new Error(
          `Total quantity (${newQuantity}) exceeds available stock (${item.stockQuantity})`
        );
      }

      // Update the quantity of the existing item
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // Add a new item to the cart
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
