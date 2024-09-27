import { Document } from "mongoose";

export interface IItem extends Document {
  name: string;
  category: string; // Or Types.ObjectId if using a Category model
  price: number;
  stockQuantity: number;
  description?: string;
  images: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
