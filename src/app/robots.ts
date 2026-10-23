import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://frandeley.example";
  return { rules: [{ userAgent: "*", disallow: "/" }], sitemap: `${origin}/sitemap.xml` };
}
