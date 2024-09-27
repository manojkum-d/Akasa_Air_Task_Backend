import express from "express";
import { json, urlencoded } from "express";
import { connectDatabase } from "./config/database.js";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import googleAuthRoutes from "./modules/auth/routes/googleAuthRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Connect to Database
connectDatabase();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
