import type { Request, Response, NextFunction } from "express";
import { jwtVerify, SignJWT } from "jose";
import { COOKIE_NAME, SESSION_MAX_AGE } from "@/constants/site";
import type { Role, SessionUser } from "@/types";
import { AuthError } from "./error.middleware";

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

const encoder = new TextEncoder();

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET is missing or too short. Set a 32+ character value in .env"
    );
  }
  return encoder.encode(secret);
}

export async function signSession(user: SessionUser, maxAge = SESSION_MAX_AGE): Promise<string> {
  return new SignJWT({ name: user.name, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(user.id)
    .setIssuedAt()
    .setIssuer("ashish-portfolio")
    .setAudience("admin")
    .setExpirationTime(`${maxAge}s`)
    .sign(secretKey());
}

export async function verifySession(token?: string | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: "ashish-portfolio",
      audience: "admin",
    });
    return {
      id: payload.sub as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

const ROLE_RANK: Record<Role, number> = { viewer: 1, editor: 2, admin: 3 };

export function hasRole(userRole: Role | undefined, required: Role): boolean {
  if (!userRole) return false;
  return ROLE_RANK[userRole] >= ROLE_RANK[required];
}

/** Express middleware to authenticate session */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      throw new AuthError("You must be signed in", 401);
    }
    const session = await verifySession(token);
    if (!session) {
      throw new AuthError("You must be signed in", 401);
    }
    req.user = session;
    next();
  } catch (error) {
    next(error);
  }
}

/** Express middleware to restrict to specific role rank */
export function requireRole(requiredRole: Role) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies[COOKIE_NAME];
      if (!token) {
        throw new AuthError("You must be signed in", 401);
      }
      const session = await verifySession(token);
      if (!session) {
        throw new AuthError("You must be signed in", 401);
      }
      if (!hasRole(session.role, requiredRole)) {
        throw new AuthError("You do not have permission to do that", 403);
      }
      req.user = session;
      next();
    } catch (error) {
      next(error);
    }
  };
}

/** Express middleware to parse session if available, but let request pass through */
export async function parseOptionalSession(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (token) {
      const session = await verifySession(token);
      if (session) {
        req.user = session;
      }
    }
  } catch (err) {
    // Ignore error, let unauthenticated request pass
  }
  next();
}

