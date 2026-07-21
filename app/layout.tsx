import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "./analytics";
import { ContactFormBridge } from "./contact-form-bridge";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const siteUrl = "https://pipelix.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AI Coding Agent for Azure DevOps Teams | Pipelix", template: "%s | Pipelix" },
  description: "Turn Azure DevOps work items, bugs, and service tickets into validated code changes while your developers retain control.",
  alternates: { canonical: "/" },
  keywords: ["AI coding agent for Azure DevOps", "Azure DevOps AI automation", "automate Azure DevOps backlog", "AI software development automation"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", url: siteUrl, siteName: "Pipelix", title: "AI Coding Agent for Azure DevOps Teams | Pipelix", description: "Turn Azure DevOps work items into validated code changes with governed AI execution.", images: [{ url: "/social-card.svg", width: 1200, height: 630, alt: "Pipelix — AI coding agent for Azure DevOps teams" }] },
  twitter: { card: "summary_large_image", title: "AI Coding Agent for Azure DevOps Teams | Pipelix", description: "Turn Azure DevOps work items into validated code changes with governed AI execution.", images: ["/social-card.svg"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  other: { "codex-preview": "development" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": siteUrl + "/#organization", name: "Pipelix", url: siteUrl, logo: siteUrl + "/favicon.svg", email: "hello@pipelix.ai" },
    { "@type": "SoftwareApplication", "@id": siteUrl + "/#software", name: "Pipelix", applicationCategory: "DeveloperApplication", operatingSystem: "Web", url: siteUrl, description: "AI engineering operations platform that turns Azure DevOps work items into validated code changes.", publisher: { "@id": siteUrl + "/#organization" } },
    { "@type": "WebSite", "@id": siteUrl + "/#website", name: "Pipelix", url: siteUrl, publisher: { "@id": siteUrl + "/#organization" } }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <Analytics /><ContactFormBridge />{children}
  </body></html>;
}
