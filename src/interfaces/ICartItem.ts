// src/interfaces/ICartItem.ts
import { Types } from "mongoose";

export interface ICartItem {
  item: Types.ObjectId;
  quantity: number;
}
