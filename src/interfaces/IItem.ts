import { Document, Types } from "mongoose";

export interface IItem extends Document {
  _id: Types.ObjectId;
  name: string;
  category: Types.ObjectId; // Reference to Category
  price: number;
  stockQuantity: number;
  description?: string;
  images: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
