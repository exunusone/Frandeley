import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Page introuvable | Frandeley" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="section-space top-page not-found shell">
      <span className="eyebrow">404 / PAGE INTROUVABLE</span>
      <h1>Le morceau a changé de piste<span className="dot">.</span></h1>
      <p>Cette page n’existe pas ou a été déplacée. Retrouvez les informations utiles sur Frandeley ci-dessous.</p>
      <Link href="/" className="button">Retour à l’accueil <span aria-hidden="true">↗</span></Link>
      <nav className="not-found-links" aria-label="Pages à découvrir">
        <Link href="/vision"><span>01 / VISION</span><strong>Pourquoi Frandeley ?</strong></Link>
        <Link href="/parcours"><span>02 / PARCOURS</span><strong>Le fil d’un morceau</strong></Link>
        <Link href="/pilote"><span>03 / PILOTE</span><strong>Contribuer aux premiers retours</strong></Link>
        <Link href="/faq"><span>04 / FAQ</span><strong>Les réponses pratiques</strong></Link>
      </nav>
    </section>
  );
}
