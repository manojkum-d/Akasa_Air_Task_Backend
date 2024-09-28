import { Types } from "mongoose";
import Order from "../models/orderModel.js";
import { IOrder } from "../../../interfaces/IOrder.js";

export const getOrdersByUserId = async (
  userId: Types.ObjectId
): Promise<IOrder[]> => {
  return Order.find({ user: userId }).populate("items.item").exec();
};

export const getOrderById = async (
  orderId: Types.ObjectId
): Promise<IOrder | null> => {
  return Order.findById(orderId).populate("items.item").exec();
};

export const updateOrderStatus = async (
  orderId: Types.ObjectId,
  orderStatus: string
): Promise<IOrder | null> => {
  return Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  ).exec();
};

export const updatePaymentStatus = async (
  orderId: Types.ObjectId,
  paymentStatus: string
): Promise<IOrder | null> => {
  return Order.findByIdAndUpdate(
    orderId,
    { paymentStatus },
    { new: true }
  ).exec();
};

export const getOrderByTrackingId = async (
  trackingId: string
): Promise<IOrder | null> => {
  return Order.findOne({ trackingId }).populate("items.item").exec();
};
