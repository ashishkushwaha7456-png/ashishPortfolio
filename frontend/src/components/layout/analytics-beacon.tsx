"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

function Beacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSent = React.useRef<string>("");

  React.useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    // React 18 strict mode mounts twice in dev — don't double count.
    if (lastSent.current === path) return;
    lastSent.current = path;

    const ANALYTICS_URL = "/api/backend/analytics";
    const payload = JSON.stringify({
      type: "pageview",
      path,
      referrer: document.referrer || undefined,
    });

    // sendBeacon survives the page unloading mid-navigation.
    // Note: sendBeacon requires an absolute URL on some browsers; use fetch as universal fallback.
    void fetch(ANALYTICS_URL, {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  }, [pathname, searchParams]);

  return null;
}

/** First-party pageview tracking. No cookies beyond an anonymous session id. */
export function AnalyticsBeacon() {
  return (
    <React.Suspense fallback={null}>
      <Beacon />
    </React.Suspense>
  );
}
