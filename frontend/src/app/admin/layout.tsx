import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Studio",
  description: "Content management for the portfolio.",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The admin tree deliberately sits outside the `(site)` group: no smooth
 * scroll, no custom cursor, no intro animation, no marketing chrome.
 * It's a tool, not a showcase.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-background">{children}</div>;
}
