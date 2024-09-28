import Cart from "../models/cartModel.js";
import Item from "../../item/models/itemModel.js";
import Order from "../../order/models/orderModel.js";
import { Types } from "mongoose";
import { ICart } from "../../../interfaces/ICart.js";
import { nanoid } from "nanoid";
import { IOrder } from "../../../interfaces/IOrder.js";

export const getCartByUserId = async (
  userId: Types.ObjectId
): Promise<ICart | null> => {
  return Cart.findOne({ user: userId }).populate("items.item").exec();
};

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

export const clearCart = async (userId: Types.ObjectId): Promise<void> => {
  await Cart.findOneAndDelete({ user: userId });
};

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

export const checkout = async (userId: Types.ObjectId): Promise<IOrder> => {
  const cart = await getCartByUserId(userId);
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  await validateStock(userId);

  const orderItems = [];
  let totalAmount = 0;

  for (const cartItem of cart.items) {
    const item = await Item.findById(cartItem.item);
    if (item) {
      if (item.stockQuantity < cartItem.quantity) {
        throw new Error(`Not enough stock for item: ${item.name}`);
      }

      item.stockQuantity -= cartItem.quantity;
      await item.save();

      orderItems.push({ item: item._id, quantity: cartItem.quantity });
      totalAmount += item.price * cartItem.quantity;
    } else {
      throw new Error(`Item with ID ${cartItem.item} not found`);
    }
  }

  const trackingId = nanoid(12);

  const newOrder = new Order({
    user: userId,
    items: orderItems,
    totalAmount,
    trackingId,
    orderStatus: "Processing",
    paymentStatus: "Paid",
  });

  await newOrder.save();

  await clearCart(userId);

  return newOrder;
};
