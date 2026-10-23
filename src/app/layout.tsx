import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RevealProvider } from "@/components/reveal";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://frandeley.example"),
  title: { default: "Frandeley — Une idée. Un morceau. La suite.", template: "%s | Frandeley" },
  description: "Frandeley prépare un parcours musical pour les artistes indépendants, de la prise sur téléphone à la démo et à la sortie préparée. Rejoignez la liste du pilote.",
  openGraph: {
    title: "Frandeley — Une idée. Un morceau. La suite.",
    description: "Le même projet, du premier enregistrement jusqu’à la revue et à la sortie. Rejoignez le pilote Frandeley.",
    images: ["/images/hero-session.webp"],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <a href="#contenu" className="skip-link">Aller au contenu</a>
        <SiteHeader />
        <main id="contenu">{children}</main>
        <SiteFooter />
        <RevealProvider />
      </body>
    </html>
  );
}
