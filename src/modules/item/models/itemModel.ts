import { Schema, model } from "mongoose";
import { IItem } from "../../../interfaces";

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true, min: 0 },
    description: { type: String },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<IItem>("Item", ItemSchema);
