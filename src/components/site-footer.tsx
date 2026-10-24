import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div>
          <Brand tone="on-dark" />
          <p>Une idée. Un morceau. La suite.</p>
          <Link className="footer-status" href="/faq"><span aria-hidden="true" />Concept en validation · Voir où en est le projet <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="footer-links">
          <div>
            <strong>Découvrir</strong>
            <Link href="/vision">Vision</Link>
            <Link href="/parcours">Parcours</Link>
            <Link href="/pilote">Le pilote</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div>
            <strong>Informations</strong>
            <Link href="/contact">Contact</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="/mentions-legales">Mentions légales</Link>
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Frandeley</span>
        <span>Projet en préparation · Conçu pour les artistes indépendants</span>
      </div>
    </footer>
  );
}
