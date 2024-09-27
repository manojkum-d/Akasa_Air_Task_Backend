import { Document, Types } from "mongoose";
import { ICartItem } from "./ICartItem";

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}
