import { Response, NextFunction } from "express";
import * as orderService from "../services/orderServices.js";
import * as cartService from "../../cart/services/cartService.js";
import { Types } from "mongoose";
import { AuthRequest } from "../../../interfaces/IauthRequest.js"; // Assuming the correct path

export const getUserOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.userId); // User ID from authenticated user
    const orders = await orderService.getOrdersByUserId(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders", error });
  }
};

export const getOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = new Types.ObjectId(req.params.orderId);
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = new Types.ObjectId(req.params.orderId);
    const { orderStatus } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(
      orderId,
      orderStatus
    );
    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};

export const updatePaymentStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = new Types.ObjectId(req.params.orderId);
    const { paymentStatus } = req.body;
    const updatedOrder = await orderService.updatePaymentStatus(
      orderId,
      paymentStatus
    );
    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating payment status", error });
  }
};

export const getOrderByTracking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { trackingId } = req.params;
    const order = await orderService.getOrderByTrackingId(trackingId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order by tracking ID", error });
  }
};

export const checkout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.userId); // User ID from authenticated user
    const newOrder = await cartService.checkout(userId);

    if (!newOrder) {
      res
        .status(400)
        .json({ message: "Checkout failed. Cart might be empty." });
      return;
    }

    res.status(201).json({
      message: "Your order has been placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Error during checkout", error });
  }
};
