const defaultSiteUrl = "https://frandeley-ten.vercel.app";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/+$/, "");
