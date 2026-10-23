import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://frandeley.example";
  return ["", "/vision", "/parcours", "/pilote", "/faq", "/contact", "/confidentialite", "/mentions-legales"].map((path) => ({ url: `${origin}${path}`, lastModified: new Date() }));
}
