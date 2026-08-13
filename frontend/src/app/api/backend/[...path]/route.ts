/**
 * Generic catch-all backend proxy.
 *
 * Browser  →  /api/backend/<anything>?<qs>  (HTTPS, same-origin on Vercel)
 *          →  {API_URL}/<anything>?<qs>      (server-side HTTP, no mixed-content)
 *
 * Supported methods: GET · POST · PUT · PATCH · DELETE
 *
 * What is forwarded:
 *  - HTTP method
 *  - Full query string (preserved from the incoming URL)
 *  - Request body (JSON, FormData/multipart, binary — via ArrayBuffer)
 *  - Content-Type header (including multipart boundary)
 *  - Authorization header (Bearer JWT from admin-client localStorage token)
 *  - portfolio_session cookie → Authorization header fallback if no Bearer present
 *
 * What is NOT forwarded:
 *  - Host / Origin / Cookie headers (would confuse the Express backend)
 *  - Any NEXT_PUBLIC_* secrets (they live only in this server-side file)
 */

import { type NextRequest, NextResponse } from "next/server";

// API_URL is a server-only variable (no NEXT_PUBLIC_ prefix).
// It is never embedded into the client bundle.
const API_URL =
  (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api").replace(
    /\/$/,
    "",
  );

const COOKIE_NAME = "portfolio_session";

// ── Helper ──────────────────────────────────────────────────────────────────

async function proxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const { path } = await params;
  const pathStr = path.join("/");

  // Preserve the full query string from the incoming request.
  const qs = request.nextUrl.searchParams.toString();
  const backendUrl = `${API_URL}/${pathStr}${qs ? `?${qs}` : ""}`;

  // ── Build forwarded headers ──────────────────────────────────────────────
  const fwdHeaders: Record<string, string> = {};

  // Content-Type (including multipart boundary for file uploads).
  const ct = request.headers.get("content-type");
  if (ct) fwdHeaders["Content-Type"] = ct;

  // Authorization — prefer the Bearer token the admin client attaches;
  // fall back to converting the httpOnly session cookie.
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    fwdHeaders["Authorization"] = authHeader;
  } else {
    const sessionCookie = request.cookies.get(COOKIE_NAME);
    if (sessionCookie?.value) {
      fwdHeaders["Authorization"] = `Bearer ${sessionCookie.value}`;
    }
  }

  // ── Forward the body ────────────────────────────────────────────────────
  let body: ArrayBuffer | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const buf = await request.arrayBuffer();
    if (buf.byteLength > 0) body = buf;
  }

  // ── Call the Express backend ─────────────────────────────────────────────
  let backendRes: Response;
  try {
    backendRes = await fetch(backendUrl, {
      method: request.method,
      headers: fwdHeaders,
      body,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Backend unreachable";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }

  // ── Stream the response back to the browser ──────────────────────────────
  const responseContentType = backendRes.headers.get("content-type") ?? "application/json";
  let responseBody: string;
  try {
    responseBody = await backendRes.text();
  } catch {
    responseBody = JSON.stringify({ success: false, error: "Failed to read backend response" });
  }

  return new NextResponse(responseBody, {
    status: backendRes.status,
    headers: { "Content-Type": responseContentType },
  });
}

// ── Route exports ────────────────────────────────────────────────────────────

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
