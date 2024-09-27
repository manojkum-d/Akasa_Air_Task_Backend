import app from "./app.js"; // Import the Express app from app.ts
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Define the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Welcome to Foodie !!!");
});
