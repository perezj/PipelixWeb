import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pipelix.ai";
  const pages = ["", "/azure-devops-ai-agent", "/security", "/privacy", "/terms", "/about"];
  return pages.map((path) => ({ url: base + path, lastModified: new Date(), changeFrequency: path ? "monthly" : "weekly", priority: path === "" ? 1 : path === "/azure-devops-ai-agent" ? 0.9 : 0.5 }));
}
