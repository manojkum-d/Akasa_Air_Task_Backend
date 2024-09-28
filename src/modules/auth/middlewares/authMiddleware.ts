import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../../interfaces/IauthRequest.js";
import { redisClient } from "../../../config/redis.js"; // Redis client

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ error: "Access denied, token missing!" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    req.userId = payload.id;

    // Check if token is stored in Redis
    const storedToken = await redisClient.get(`session:${req.userId}`);
    if (!storedToken || storedToken !== token) {
      res.status(401).json({ error: "Invalid or expired session" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
