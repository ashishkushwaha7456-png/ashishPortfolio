import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { formatZodIssues } from "@/validators";

export class AuthError extends Error {
  status: 401 | 403;
  constructor(message: string, status: 401 | 403 = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof AuthError) {
    return res.status(error.status).json({
      success: false,
      error: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(422).json({
      success: false,
      error: "Validation failed",
      issues: formatZodIssues(error),
    });
  }

  const message = error.message || "Unexpected error";

  // MongoDB Duplicate key error handler
  if (message.includes("E11000")) {
    const field = /index: (\w+)_/.exec(message)?.[1] ?? "value";
    return res.status(409).json({
      success: false,
      error: `That ${field} is already taken`,
    });
  }

  console.error("[api-error]", error);

  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Something went wrong" : message,
  });
}
