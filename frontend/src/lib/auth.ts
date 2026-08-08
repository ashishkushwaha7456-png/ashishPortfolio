import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { COOKIE_NAME, SESSION_MAX_AGE } from "@/constants/site";
import type { Role, SessionUser } from "@/types";

/**
 * `jose` is used (not `jsonwebtoken`) because the middleware runs on the Edge
 * runtime, where Node crypto isn't available.
 */

const encoder = new TextEncoder();

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET is missing or too short. Set a 32+ character value in .env.local",
    );
  }
  return encoder.encode(secret);
}

export interface SessionPayload extends JWTPayload {
  sub: string;
  name: string;
  email: string;
  role: Role;
}

export async function signSession(user: SessionUser, maxAge = SESSION_MAX_AGE) {
  return new SignJWT({ name: user.name, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(user.id)
    .setIssuedAt()
    .setIssuer("ashish-portfolio")
    .setAudience("admin")
    .setExpirationTime(`${maxAge}s`)
    .sign(secretKey());
}

export async function verifySession(token?: string | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: "ashish-portfolio",
      audience: "admin",
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/** Reads the session from the request cookies — server components & handlers. */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const payload = await verifySession(token);
  if (!payload) return null;
  return {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
}

export async function setSessionCookie(token: string, maxAge = SESSION_MAX_AGE) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

const ROLE_RANK: Record<Role, number> = { viewer: 1, editor: 2, admin: 3 };

export function hasRole(role: Role | undefined, required: Role) {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[required];
}

/** Throws a typed error the API layer turns into 401/403. */
export class AuthError extends Error {
  constructor(
    message: string,
    public status: 401 | 403 = 401,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireSession(required: Role = "editor"): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new AuthError("You must be signed in", 401);
  if (!hasRole(session.role, required)) {
    throw new AuthError("You do not have permission to do that", 403);
  }
  return session;
}
