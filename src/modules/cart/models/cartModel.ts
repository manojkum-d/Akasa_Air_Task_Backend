import { Schema, model } from "mongoose";
import { ICart } from "../../../interfaces/ICart.js";
import { ICartItem } from "../../../interfaces/ICartItem.js";

const CartItemSchema = new Schema<ICartItem>({
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export default model<ICart>("Cart", CartSchema);
