import express from "express";
import { json, urlencoded } from "express";
import { connectDatabase } from "./config/database.js";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import googleAuthRoutes from "./modules/auth/routes/googleAuthRoutes.js";
import itemRoutes from "./modules/item/routes/itemRoutes.js";
import categoryRoutes from "./modules/item/routes/categoryRoutes.js";
import cartRoutes from "./modules/cart/routes/cartRoutes.js";
import { connectRedis } from "./config/redis.js";

dotenv.config();

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Connect to Database
connectDatabase();

// Connect to Redis Cloud
connectRedis();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
