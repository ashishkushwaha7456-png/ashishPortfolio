/**
 * Resume download.
 *
 * Browser → /api/resume
 *        → GET {API_URL}/content/resume        (the resume record, server-side)
 *        → GET record.fileUrl                  (the actual PDF, e.g. on S3)
 *        → streamed back as an attachment
 *
 * The file always comes from whatever the backend record points at — nothing
 * is served from the local /public folder — so replacing the PDF in
 * /admin/resume is all it takes to change what this route hands out.
 */

import { NextResponse } from "next/server";
import { SITE_URL } from "@/constants/site";

const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api"
).replace(/\/$/, "");

/**
 * Uploading a new resume in /admin/resume must take effect straight away, so
 * the record is never cached; only the finished response is held briefly, to
 * absorb bursts.
 */
const CACHE_SECONDS = 60;

const DOWNLOAD_NAME = "Ashish-Kumar-Resume";

function fail(message: string, status = 502) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET() {
  // 1 ── Ask the backend where the current resume lives.
  let fileUrl: string | undefined;
  try {
    const res = await fetch(`${API_URL}/content/resume`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fail(`Resume API responded ${res.status}`);
    const json = (await res.json()) as { success?: boolean; data?: { fileUrl?: string } };
    fileUrl = json?.data?.fileUrl;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Resume API unreachable");
  }

  if (!fileUrl) return fail("No resume file is configured", 404);

  // A stored relative path is resolved against this site; absolute URLs
  // (S3, Cloudinary, …) are used as-is.
  const absolute = /^https?:\/\//i.test(fileUrl) ? fileUrl : `${SITE_URL}${fileUrl}`;

  // 2 ── Stream the file back under a stable, human-readable filename.
  let fileRes: Response;
  try {
    fileRes = await fetch(absolute, { cache: "no-store" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Resume file unreachable");
  }
  if (!fileRes.ok || !fileRes.body) return fail(`Resume file responded ${fileRes.status}`);

  const extension = absolute.split("?")[0].split(".").pop()?.toLowerCase();
  const filename = extension && extension.length <= 5 ? `${DOWNLOAD_NAME}.${extension}` : DOWNLOAD_NAME;

  return new NextResponse(fileRes.body, {
    headers: {
      "Content-Type": fileRes.headers.get("content-type") ?? "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": `public, max-age=0, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=300`,
    },
  });
}
