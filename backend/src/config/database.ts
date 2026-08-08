import mongoose from "mongoose";

export async function connectDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("[db] MONGODB_URI is not configured. Falling back to seed data.");
    return false;
  }

  mongoose.set("strictQuery", true);

  // If already connected
  if (mongoose.connection.readyState === 1) return true;

  try {
    await mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
      family: 4,
    });
    console.log("[db] MongoDB connected successfully.");
    return true;
  } catch (error) {
    console.error("[db] MongoDB connection failed:", (error as Error).message);
    return false;
  }
}

/** Helper to check database state */
export function isDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/** Utility to run a query against the DB, falling back to seed content if DB is unavailable */
export async function withDB<T>(
  fn: () => Promise<T>,
  fallback: T,
  label = "query"
): Promise<T> {
  const connected = await connectDatabase();
  if (!connected) return fallback;
  try {
    return await fn();
  } catch (error) {
    console.error(`[db] ${label} failed:`, (error as Error).message);
    return fallback;
  }
}
