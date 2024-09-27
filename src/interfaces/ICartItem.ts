import { Types } from "mongoose";

export interface ICartItem {
  item: Types.ObjectId;
  quantity: number;
}
