import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Mentions légales", "Informations éditoriales et légales du site Frandeley.", "/mentions-legales");

export default function LegalPage() {
  return (
    <section className="section-space top-page legal-page">
      <div className="shell">
        <span className="eyebrow">INFORMATIONS / ÉDITEUR</span>
        <h1>Mentions légales<span className="dot">.</span></h1>
        <p className="legal-intro">Frandeley est un site de prélancement publié en ligne. Les informations qui dépendent du statut et des coordonnées de l’éditeur sont encore à compléter.</p>
        <div className="legal-facts" aria-label="Repères sur le site">
          <article><span>PROJET</span><strong>Frandeley</strong><p>Concept de studio musical et d’organisateur web en validation.</p></article>
          <article><span>PORTEUR DU PROJET</span><strong>Djeferson Exunus</strong><p>Contact par le formulaire dédié du site.</p></article>
          <article><span>HÉBERGEMENT</span><strong>Vercel Inc.</strong><p>Déploiement et fonctions web du prélancement.</p></article>
        </div>
        <div className="legal-missing"><strong>Informations à compléter</strong><p>Le statut juridique, l’adresse postale de l’éditeur, le téléphone et les identifiants administratifs ne nous ont pas été communiqués. Ils ne sont donc pas inventés sur cette page.</p></div>
        <div className="legal-content">
          <h2>Édition</h2>
          <p>Projet : Frandeley. Porteur du projet : Djeferson Exunus. Contact : <Link href="/contact">formulaire de contact</Link>.</p>
          <p>Statut juridique, adresse postale de l’éditeur, téléphone et identifiants administratifs : à renseigner par le porteur du projet. Aucune société ni immatriculation n’est affirmée sur ce site. Le contact disponible est le <Link href="/contact">formulaire de contact</Link>.</p>
          <h2>Hébergement</h2>
          <p>Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis. Pour contacter Vercel au sujet de sa notice de confidentialité : <a href="mailto:privacy@vercel.com">privacy@vercel.com</a>. Les <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noreferrer">informations publiées par Vercel</a> peuvent évoluer.</p>
          <h2>Contenus et visuels</h2>
          <p>La marque Frandeley et les contenus éditoriaux sont utilisés pour présenter le projet. Les photographies de ce site sont des visuels de conception générés pour illustrer des situations de création ; elles ne représentent pas les fonctionnalités déjà disponibles ni des utilisateurs du pilote.</p>
          <h2>Données personnelles</h2>
          <p>Pour connaître l’usage des formulaires et vos droits, consultez la <Link href="/confidentialite">politique de confidentialité</Link>.</p>
          <h2>Statut du projet</h2>
          <p>Les descriptions, images et vidéos présentent une direction de conception en prélancement. Elles ne constituent pas une démonstration de fonctions actuellement accessibles. L’état du projet et les questions fréquentes sont détaillés dans la <Link href="/faq">FAQ</Link>.</p>
        </div>
      </div>
    </section>
  );
}
