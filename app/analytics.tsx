"use client";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const rawId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const id = rawId && /^[A-Za-z0-9-]+$/.test(rawId) ? rawId : undefined;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPagePath = useRef<string>();
  const queryString = useMemo(() => searchParams?.toString() ?? "", [searchParams]);

  useEffect(() => {
    if (!id || !pathname) return;
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;
    if (lastTrackedPagePath.current === pagePath) return;

    const trackPageView = () => {
      if (!window.gtag) return false;
      const pageView = { page_path: pagePath, page_location: window.location.href };
      window.gtag("event", "page_view", pageView);
      lastTrackedPagePath.current = pagePath;
      return true;
    };

    if (trackPageView()) return;
    const timer = window.setTimeout(trackPageView, 0);
    return () => window.clearTimeout(timer);
  }, [id, pathname, queryString]);

  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`} strategy="afterInteractive" />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', ${JSON.stringify(id)}, { anonymize_ip: true });
          `,
        }}
      />
    </>
  );
}
