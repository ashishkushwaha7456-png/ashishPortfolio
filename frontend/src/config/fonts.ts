import { Inter, JetBrains_Mono, Sora } from "next/font/google";

/**
 * Three faces, each with one job:
 *   Inter          — body copy and UI
 *   Sora           — display headings (tighter, more geometric)
 *   JetBrains Mono — code, metrics, timestamps
 *
 * All self-hosted by next/font (zero layout shift, no external request) and
 * loaded as variable fonts so weight changes cost nothing extra.
 */

export const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  adjustFontFallback: true,
});

export const fontHeading = Sora({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  adjustFontFallback: true,
});

export const fontCode = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-code",
});

export const fontVariables = [
  fontBody.variable,
  fontHeading.variable,
  fontCode.variable,
].join(" ");
