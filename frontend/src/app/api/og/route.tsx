import { ImageResponse } from "next/og";
import { PERSON } from "@/constants/site";

export const runtime = "edge";

/**
 * GET /api/og?title=…&subtitle=…&tag=…
 *
 * Dynamic Open Graph card. Runs on the edge and is cached by the CDN, so
 * every page gets a bespoke share image without a build-time render.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = (searchParams.get("title") ?? PERSON.name).slice(0, 90);
  const subtitle = (
    searchParams.get("subtitle") ?? `${PERSON.title} · ${PERSON.subtitle}`
  ).slice(0, 140);
  const tag = searchParams.get("tag") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b12",
          padding: "72px",
          position: "relative",
        }}
      >
        {/* Glows */}
        <div
          style={{
            position: "absolute",
            top: -240,
            left: -160,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(99,102,241,0.42), rgba(99,102,241,0) 68%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -280,
            right: -180,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(34,211,238,0.32), rgba(34,211,238,0) 68%)",
            display: "flex",
          }}
        />

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "#a78bfa",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            AK
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#fafafa", fontSize: 24, fontWeight: 600 }}>
              {PERSON.name}
            </span>
            <span style={{ color: "rgba(250,250,250,0.5)", fontSize: 17 }}>
              {PERSON.shortLocation}
            </span>
          </div>

          {tag && (
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                padding: "8px 18px",
                borderRadius: 9999,
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(250,250,250,0.75)",
                fontSize: 17,
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              {tag}
            </div>
          )}
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              display: "flex",
              width: 96,
              height: 6,
              borderRadius: 4,
              marginBottom: 30,
              background: "linear-gradient(90deg, #6366f1, #22d3ee)",
            }}
          />
          <div
            style={{
              color: "#ffffff",
              fontSize: title.length > 48 ? 60 : 74,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 22,
              color: "rgba(250,250,250,0.62)",
              fontSize: 27,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 26,
          }}
        >
          <span style={{ color: "rgba(250,250,250,0.45)", fontSize: 20 }}>
            React · Next.js · TypeScript · Node.js · MongoDB
          </span>
          <span style={{ color: "rgba(250,250,250,0.45)", fontSize: 20 }}>
            {PERSON.email}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
