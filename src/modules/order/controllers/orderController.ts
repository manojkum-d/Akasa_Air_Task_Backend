import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import * as orderService from "../services/orderServices.js";

/**
 * Get order history for the logged-in user.
 */
export const getOrderHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.userId); // Convert userId to Types.ObjectId
    const orders = await orderService.getOrderHistory(userId);
    void res.json({ orders }); // Explicitly cast to void
  } catch (error) {
    next(error);
  }
};

/**
 * Checkout process: Create an order based on the user's cart.
 */
export const checkout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.userId); // Convert userId to Types.ObjectId
    const order = await orderService.checkout(userId);
    void res.status(201).json({ message: "Order placed successfully", order }); // Explicitly cast to void
  } catch (error) {
    next(error);
  }
};

/**
 * Get an order by ID.
 */
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = req.params.id; // Get order ID from the request params
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return void res.status(404).json({ error: "Order not found" }); // Explicitly cast to void
    }

    void res.json({ order }); // Explicitly cast to void
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing order by ID.
 */
export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = req.params.id; // Get order ID from the request params
    const orderData = req.body; // Get order data from the request body
    const updatedOrder = await orderService.updateOrder(orderId, orderData);

    if (!updatedOrder) {
      return void res.status(404).json({ error: "Order not found" }); // Explicitly cast to void
    }

    void res.json({
      message: "Order updated successfully",
      order: updatedOrder,
    }); // Explicitly cast to void
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an order by ID.
 */
export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = req.params.id; // Get order ID from the request params
    const deletedOrder = await orderService.deleteOrder(orderId);

    if (!deletedOrder) {
      return void res.status(404).json({ error: "Order not found" }); // Explicitly cast to void
    }

    void res.json({
      message: "Order deleted successfully",
      order: deletedOrder,
    }); // Explicitly cast to void
  } catch (error) {
    next(error);
  }
};
