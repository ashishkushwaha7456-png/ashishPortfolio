import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants/site";

const API_URL = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api").replace(/\/$/, "");

export async function POST() {
  // Attempt backend logout (ignore failure — we always clear the local cookie)
  try {
    await fetch(`${API_URL}/admin/auth/logout`, { method: "POST" });
  } catch {}

  // Clear the session cookie directly on the NextResponse.
  const response = NextResponse.json({
    success: true,
    data: { signedOut: true },
  });

  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
