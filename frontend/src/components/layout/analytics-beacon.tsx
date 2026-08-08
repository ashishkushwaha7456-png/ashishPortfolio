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

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api";
    const payload = JSON.stringify({
      type: "pageview",
      path,
      referrer: document.referrer || undefined,
    });

    // sendBeacon survives the page unloading mid-navigation.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${API_URL}/analytics`, new Blob([payload], { type: "application/json" }));
    } else {
      void fetch(`${API_URL}/analytics`, {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
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
