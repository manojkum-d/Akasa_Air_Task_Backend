import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { IUser } from "../../../interfaces/IUser.js";

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ email, password: hashedPassword, name });
  await newUser.save();

  return newUser;
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ token: string; userId: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "15d", // Token expires in 15 days
  });

  return { token, userId: user.id };
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId);
};
