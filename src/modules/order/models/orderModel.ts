import { Schema, model } from "mongoose";
import { IOrder, ICartItem } from "../../../interfaces";

const OrderItemSchema = new Schema<ICartItem>({
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    trackingId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default model<IOrder>("Order", OrderSchema);
