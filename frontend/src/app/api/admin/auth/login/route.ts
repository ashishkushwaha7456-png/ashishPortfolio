import { NextResponse } from "next/server";
import { COOKIE_NAME, SESSION_MAX_AGE } from "@/constants/site";

const API_URL = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api").replace(/\/$/, "");

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${API_URL}/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await backendRes.json();

    if (!backendRes.ok || !json.success) {
      return NextResponse.json(
        { success: false, error: json.error || "Sign in failed" },
        { status: backendRes.status || 400 },
      );
    }

    const token: string | undefined = json.data?.token;
    const maxAge: number = body.remember ? SESSION_MAX_AGE : 60 * 60 * 12;

    // Set the cookie directly on the NextResponse — the only reliable way to
    // emit a Set-Cookie header from a Next.js Route Handler.
    const response = NextResponse.json(json);

    if (token) {
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge,
      });
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
