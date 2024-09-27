import { Document, Types } from "mongoose";
import { ICartItem } from "./ICartItem.js";

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  trackingId: string;
  createdAt: Date;
  updatedAt: Date;
}
