import type { Metadata } from "next";
import Image from "next/image";
import { InnerHero } from "@/components/inner-hero";
import { SectionCta } from "@/components/section-cta";

export const metadata: Metadata = {
  title: "La vision",
  description: "Frandeley explore un fil continu pour les artistes indépendants : de la première idée au morceau prêt à être partagé.",
};

export default function VisionPage() {
  return (
    <>
      <InnerHero
        number="01 — VISION"
        title={<>Le contexte du morceau<br />mérite de rester avec lui<span className="dot">.</span></>}
        description="Une même chanson traverse des notes vocales, des fichiers, des échanges et des décisions. Frandeley cherche à relier ces moments."
        image="/images/notebook.webp"
        alt="Carnet d’idées musicales et casque dans un studio"
      />
      <section className="section-space">
        <div className="shell editorial-grid">
          <div data-reveal>
            <span className="eyebrow">Le point de départ</span>
            <h2>Une idée ne devrait pas se perdre entre deux outils<span className="dot">.</span></h2>
          </div>
          <div className="editorial-body" data-reveal>
            <p>Une prise rapide sur le téléphone, des paroles dans une note, un retour dans une messagerie, une autre version dans un dossier : le travail avance, mais son histoire se disperse.</p>
            <p>Notre hypothèse est simple : si l’artiste retrouve la bonne prise et son contexte sans reconstruction, il peut consacrer plus de temps à la musique. C’est cette hypothèse que nous voulons confronter à des projets réels.</p>
          </div>
        </div>
      </section>
      <section className="principles-section section-space">
        <div className="shell">
          <div className="section-topline"><span>LES PRINCIPES</span><span>01 — 03</span></div>
          <div className="principle-list">
            <article data-reveal><span>01</span><h3>Continuité</h3><p>Retrouver les prises, les paroles, les versions et les décisions autour du même morceau.</p></article>
            <article data-reveal><span>02</span><h3>Clarté</h3><p>Savoir quelle version est partagée, ce qui a changé et ce qu’il reste à préparer.</p></article>
            <article data-reveal><span>03</span><h3>Autonomie</h3><p>L’artiste garde la direction créative et valide les crédits, les droits et la publication.</p></article>
          </div>
        </div>
      </section>
      <section className="split-feature">
        <div className="split-media"><Image src="/images/mobile-web.webp" alt="Projet musical visible sur téléphone et ordinateur" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
        <div className="split-copy" data-reveal>
          <span className="eyebrow">Mobile pour créer, web pour prendre du recul</span>
          <h2>Le même morceau,<br />deux bons moments<span className="dot">.</span></h2>
          <p>Le téléphone accueille la création spontanée. Le web aide à revoir les versions, coordonner les retours et préparer les éléments de sortie. La transition doit garder le contexte sans ressaisie.</p>
          <SectionCta label="Découvrir le parcours" href="/parcours" />
        </div>
      </section>
      <section className="text-cta section-space">
        <div className="shell" data-reveal>
          <span className="eyebrow">Un projet à éprouver avec vous</span>
          <h2>La preuve viendra des morceaux terminés, pas des promesses<span className="dot">.</span></h2>
          <p>Nous voulons observer ce que ce parcours change réellement pour les artistes qui ont un morceau en cours.</p>
          <SectionCta />
        </div>
      </section>
    </>
  );
}
