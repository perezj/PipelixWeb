"use client";
import { useEffect } from "react";

declare global { interface Window { dataLayer?: unknown[] } }

export function Analytics() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!id) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
    window.dataLayer.push(["js", new Date()]);
    window.dataLayer.push(["config", id, { anonymize_ip: true }]);
    return () => script.remove();
  }, []);
  return null;
}
