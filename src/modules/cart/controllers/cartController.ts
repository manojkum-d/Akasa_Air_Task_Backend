import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as cartService from "../services/cartServices.js";

/**
 * Get the cart for the logged-in user.
 */
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.userId); // Convert userId to Types.ObjectId
    const cart = await cartService.getCartByUserId(userId);
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }
    res.json({ cart });
  } catch (error) {
    next(error);
  }
};

/**
 * Add an item to the user's cart.
 */
export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.userId); // Convert userId to Types.ObjectId
    const { itemId, quantity } = req.body;

    if (!itemId || !quantity) {
      res.status(400).json({ error: "Item ID and quantity are required" });
      return;
    }

    const itemObjectId = new Types.ObjectId(itemId); // Convert itemId to Types.ObjectId
    const updatedCart = await cartService.addItemToCart(
      userId,
      itemObjectId,
      quantity
    );
    res
      .status(201)
      .json({ message: "Item added to cart successfully", cart: updatedCart });
  } catch (error: any) {
    // Handle the error and respond with a meaningful message
    res.status(400).json({ error: error.message });
  }
};

/**
 * Remove an item from the user's cart.
 */
export const removeItemFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.userId); // Convert userId to Types.ObjectId
    const { itemId } = req.body;

    if (!itemId) {
      res.status(400).json({ error: "Item ID is required" });
      return;
    }

    const itemObjectId = new Types.ObjectId(itemId); // Convert itemId to Types.ObjectId
    const updatedCart = await cartService.removeItemFromCart(
      userId,
      itemObjectId
    );
    if (!updatedCart) {
      res.status(404).json({ error: "Item not found in cart" });
      return;
    }
    res.json({
      message: "Item removed from cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear the user's cart.
 */
export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.userId); // Convert userId to Types.ObjectId
    await cartService.clearCart(userId);
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    next(error);
  }
};
