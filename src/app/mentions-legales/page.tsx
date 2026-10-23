import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Mentions légales", description: "Informations éditoriales et légales du site Frandeley." };

export default function LegalPage() {
  return (
    <section className="section-space top-page legal-page">
      <div className="shell">
        <span className="eyebrow">INFORMATIONS / ÉDITEUR</span>
        <h1>Mentions légales<span className="dot">.</span></h1>
        <p className="legal-intro">Frandeley est un projet musical en préparation. Les informations administratives définitives doivent être renseignées avant l’ouverture publique.</p>
        <div className="legal-content">
          <h2>Édition</h2>
          <p>Projet : Frandeley. Porteur du projet : Djeferson Exunus. Contact : <Link href="/contact">formulaire de contact</Link>.</p>
          <p>Statut juridique, adresse de domiciliation et autres identifiants administratifs : à compléter avant publication publique. Aucune société ou immatriculation n’est affirmée sur ce site.</p>
          <h2>Hébergement</h2>
          <p>Les coordonnées de l’hébergeur seront indiquées lorsque l’hébergement définitif du site sera choisi.</p>
          <h2>Contenus et visuels</h2>
          <p>La marque Frandeley et les contenus éditoriaux sont utilisés pour présenter le projet. Les photographies de ce site sont des visuels de conception générés pour illustrer des situations de création ; elles ne représentent pas les fonctionnalités déjà disponibles ni des utilisateurs du pilote.</p>
          <h2>Données personnelles</h2>
          <p>Pour connaître l’usage des formulaires et vos droits, consultez la <Link href="/confidentialite">politique de confidentialité</Link>.</p>
        </div>
      </div>
    </section>
  );
}
