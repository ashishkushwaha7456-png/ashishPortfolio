import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Cursor } from "@/components/layout/cursor";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { CommandPalette } from "@/components/layout/command-palette";
import { PageTransition } from "@/components/layout/page-transition";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import { AnalyticsBeacon } from "@/components/layout/analytics-beacon";
import { JsonLd } from "@/components/seo/json-ld";
import { getSettings, getSocialLinks } from "@/services/content.service";
import { personSchema, websiteSchema } from "@/lib/seo";

/**
 * Public site shell. The admin panel lives outside this group so it gets none
 * of the marketing chrome — no cursor, no smooth scroll, no intro.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socials, settings] = await Promise.all([getSocialLinks(), getSettings()]);

  return (
    <SmoothScrollProvider>
      <JsonLd
        data={[
          personSchema({ sameAs: socials.filter((s) => s.url.startsWith("http")).map((s) => s.url) }),
          websiteSchema(),
        ]}
      />

      {settings.features.loadingScreen && <LoadingScreen />}
      {settings.features.cursor && <Cursor />}
      <CommandPalette />
      {settings.features.analytics && <AnalyticsBeacon />}

      <Navbar />

      <main id="main" className="relative">
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer
        socials={socials}
        available={settings.availableForWork}
        showNowPlaying={settings.features.spotify}
      />
    </SmoothScrollProvider>
  );
}
