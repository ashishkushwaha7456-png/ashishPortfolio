import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/database";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to database
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`[server] Express server running on port ${PORT}`);
  });

  const shutdown = () => {
    console.log("[server] Shutdown signal received. Closing server gracefully...");
    server.close(async () => {
      console.log("[server] Express server closed.");
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log("[db] MongoDB connection closed.");
      }
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error("[server] Failed to start server:", error);
  process.exit(1);
});
