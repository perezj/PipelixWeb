"use client";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSkippedInitialPageTracking = useRef(false);
  const query = searchParams?.toString() ?? "";

  useEffect(() => {
    if (!id || !pathname) return;
    if (!hasSkippedInitialPageTracking.current) {
      hasSkippedInitialPageTracking.current = true;
      return;
    }
    if (window.gtag) {
      const pagePath = query ? `${pathname}?${query}` : pathname;
      const pageView = { page_path: pagePath, page_location: window.location.href, page_title: document.title };
      window.gtag("event", "page_view", pageView);
      return;
    }
  }, [id, pathname, query]);

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
