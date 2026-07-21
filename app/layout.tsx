import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ContactFormBridge } from "./contact-form-bridge";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pipelix | AI Engineering Operations for Azure DevOps",
  description: "Turn Azure DevOps backlogs, bugs, and service tickets into verified code delivery with Pipelix.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ContactFormBridge />
        {children}
      </body>
    </html>
  );
}
