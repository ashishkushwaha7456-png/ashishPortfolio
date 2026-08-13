import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { connectDatabase } from "@/config/database";
import { UserModel } from "@/models";
import { signSession } from "@/middlewares/auth.middleware";
import { clientIp, rateLimit } from "@/middlewares/rate-limit.middleware";

import { loginSchema } from "@/validators";
import { COOKIE_NAME, SESSION_MAX_AGE } from "@/constants/site";
import type { AdminUser, SessionUser } from "@/types";
import { asyncHandler } from "@/utils/async-handler";
import { AuthError } from "@/middlewares/error.middleware";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const ip = clientIp(req);
  const maxAttempts = process.env.NODE_ENV === "production" ? 5 : 50;
  const limit = rateLimit(`login:${ip}`, maxAttempts, 5 * 60_000);
  if (!limit.allowed) {
    return res.status(429).json({
      success: false,
      error: "Too many attempts. Try again in a few minutes.",
    });
  }

  const { email, password, remember } = loginSchema.parse(req.body);
  const normalisedEmail = email.toLowerCase().trim();

  let user: SessionUser | null = null;

  const conn = await connectDatabase();
  if (conn) {
    const doc = await UserModel.findOne({ email: normalisedEmail, active: true })
      .select("+password")
      .lean<AdminUser>();

    if (doc?.password && (await bcrypt.compare(password, doc.password))) {
      user = {
        id: String(doc._id),
        name: doc.name,
        email: doc.email,
        role: doc.role,
      };
      await UserModel.findByIdAndUpdate(doc._id, {
        lastLogin: new Date().toISOString(),
      });
    }
  }

  if (!user) {
    const envEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const envPassword = process.env.ADMIN_PASSWORD;
    // console.log({envEmail,envPassword,password,email});

    if (envEmail && envPassword && normalisedEmail === envEmail && password === envPassword) {
      user = {
        id: "env-admin",
        name: "Ashish Kumar",
        email: envEmail,
        role: "admin",
      };
    }
  }

  if (!user) {
    throw new AuthError("Incorrect email or password", 401);
  }

  const maxAge = remember ? SESSION_MAX_AGE : 60 * 60 * 12; // in seconds
  const token = await signSession(user, maxAge);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge * 1000, // Express maxAge is in milliseconds!
  });

  res.json({
    success: true,
    data: { user, token },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  res.json({
    success: true,
    data: { signedOut: true },
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AuthError("Not signed in", 401);
  }
  res.json({
    success: true,
    data: { user: req.user },
  });
});
