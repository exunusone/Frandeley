import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";
  const rules = isProduction
    ? [{ userAgent: "*", allow: "/" }]
    : [{ userAgent: "*", disallow: "/" }];

  return { rules, sitemap: `${siteUrl}/sitemap.xml` };
}
