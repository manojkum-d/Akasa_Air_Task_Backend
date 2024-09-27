import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  registerUser,
  authenticateUser,
  getUserById,
} from "../services/authService.js";
import { AuthRequest } from "../../../interfaces/IauthRequest.js";
import { IUser } from "../../../interfaces/IUser.js";

// Generate a JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// Register a new user and return a JWT token
export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password, name } = req.body;
  try {
    // Register the user
    const user = await registerUser(email, password, name);

    // Generate an access token
    const token = generateToken(user.id);

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      token, // Return the token in the response
    });
  } catch (error) {
    next(error);
  }
};

// Login a user and return a JWT token
export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  try {
    // Authenticate the user
    const { token } = await authenticateUser(email, password);
    res.json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

// Get the user profile and return a JWT token
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: User ID is missing" });
      return; // Exit the function
    }

    // Get user details by userId
    const user = (await getUserById(userId)) as IUser;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return; // Exit the function
    }

    // Generate a new token or return the existing token
    const token = generateToken(userId);

    // Send user profile with token
    res.json({ email: user.email, name: user.name, token });
  } catch (error) {
    next(error);
  }
};
