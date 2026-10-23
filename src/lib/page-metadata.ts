import type { Metadata } from "next";

const shareImage = "/images/hero-session.webp";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const shareTitle = `${title} | Frandeley`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      images: [shareImage],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [shareImage],
    },
  };
}
