import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  registerUser,
  authenticateUser,
  getUserById,
} from "../services/authService.js";
import { AuthRequest } from "../../../interfaces/IauthRequest.js";
import { IUser } from "../../../interfaces/IUser.js";
import { redisClient } from "../../../config/redis.js"; // Redis client

// Generate a JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15d", // Token expires in 15 days
  });
};

// Store token in Redis with a TTL
const storeTokenInRedis = async (userId: string, token: string) => {
  const redisKey = `session:${userId}`;
  await redisClient.set(redisKey, token, { EX: 15 * 24 * 60 * 60 }); // Token expires in 15 days
};

// Register a new user and return a JWT token
export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password, name } = req.body;
  try {
    const user = await registerUser(email, password, name);

    const token = generateToken(user.id);
    await storeTokenInRedis(user.id, token);

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      token,
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
    const { token, userId } = await authenticateUser(email, password);

    await storeTokenInRedis(userId, token);

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
      return;
    }

    const user = (await getUserById(userId)) as IUser;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Retrieve the token from Redis
    let token = await redisClient.get(`session:${userId}`);

    if (!token) {
      token = generateToken(userId);
      await storeTokenInRedis(userId, token);
    }

    res.json({ email: user.email, name: user.name, token });
  } catch (error) {
    next(error);
  }
};
