import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Page introuvable | Frandeley" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <section className="section-space top-page not-found shell"><span className="eyebrow">404 / PAGE INTROUVABLE</span><h1>Le morceau a changé de piste<span className="dot">.</span></h1><p>Cette page n’existe pas ou a été déplacée.</p><Link href="/" className="button">Retour à l’accueil <span aria-hidden="true">↗</span></Link></section>;
}
