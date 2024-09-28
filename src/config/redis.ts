import { createClient } from "redis";

// Create a new Redis client using the Cloud credentials
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost", // Default to localhost for development
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
  password: process.env.REDIS_PASSWORD, // Use password for Redis Cloud authentication
});

// Handle connection errors
redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Function to connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect(); // Connect the client
    console.log("Connected to Redis Cloud");
  } catch (err) {
    console.error("Could not connect to Redis:", err);
  }
};

export { redisClient, connectRedis };
