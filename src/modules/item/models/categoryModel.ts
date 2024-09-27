import { Schema, model } from "mongoose";
import { ICategory } from "../../../interfaces";

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default model<ICategory>("Category", CategorySchema);
