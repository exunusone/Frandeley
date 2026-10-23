import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/vision", "/parcours", "/pilote", "/faq", "/contact", "/confidentialite", "/mentions-legales"]
    .map((path) => ({ url: `${siteUrl}${path}` }));
}
