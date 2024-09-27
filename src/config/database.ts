import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

export const connectDatabase = async () => {
  try {
    // Use the new MongoDB driver URL string parser and topology engine
    await mongoose.connect(MONGO_URI);

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  }

  // Connection events
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to " + MONGO_URI);
  });

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error: " + err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
  });

  // Close the Mongoose connection when the Node.js process ends
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Mongoose disconnected on app termination");
    process.exit(0);
  });
};
