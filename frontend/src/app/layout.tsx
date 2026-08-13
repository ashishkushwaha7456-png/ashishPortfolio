import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/config/fonts";
import { Providers } from "@/components/providers";
import { buildMetadata } from "@/lib/seo";
import { getSEO } from "@/services/content.service";
import { SITE_CONFIG } from "@/constants/site";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  return buildMetadata({ seo, type: "profile" });
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: SITE_CONFIG.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: SITE_CONFIG.themeColor.dark },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <head>
        {/* Warm up the font CDN before the CSS that needs it parses. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body suppressHydrationWarning className="min-h-dvh bg-background font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
