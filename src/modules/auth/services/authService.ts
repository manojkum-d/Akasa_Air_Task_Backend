import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { IUser } from "../../../interfaces/IUser.js";

export const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<IUser> => {
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({ email, password: hashedPassword, name });

  // Save the user in the database
  await newUser.save();

  return newUser;
};

// Authenticate a user by email and password and generate a JWT token
export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ token: string; userId: string }> => {
  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  // Compare the password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate a JWT token for the user
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  return { token, userId: user.id };
};

// Get user by ID
export const getUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId);
};
