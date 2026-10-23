import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Confidentialité", description: "Informations sur la collecte et l’utilisation des données personnelles sur le site Frandeley." };

export default function PrivacyPage() {
  return (
    <section className="section-space top-page legal-page">
      <div className="shell">
        <span className="eyebrow">INFORMATIONS / DONNÉES PERSONNELLES</span>
        <h1>Confidentialité<span className="dot">.</span></h1>
        <p className="legal-intro">Cette page décrit les informations recueillies par le site de prélancement Frandeley. Dernière mise à jour : 23 octobre 2026.</p>
        <div className="legal-content">
          <h2>Responsable et contact</h2>
          <p>Le projet Frandeley est porté par Djeferson Exunus. Pour une question ou l’exercice de vos droits, utilisez le <Link href="/contact">formulaire de contact</Link> en choisissant « Mes données personnelles ».</p>
          <h2>Données et finalités</h2>
          <p>Le formulaire pilote recueille le nom d’artiste et l’adresse e-mail obligatoires, ainsi que, si vous les fournissez, votre pratique et quelques mots sur un morceau. Ces informations servent à gérer les manifestations d’intérêt et à organiser les échanges et essais du pilote. La case facultative « nouvelles du projet » permet de recevoir des informations sur Frandeley. Aucun paiement n’est collecté.</p>
          <p>Le formulaire de contact recueille votre nom, votre e-mail, le sujet et le contenu du message pour y répondre. Sans les champs obligatoires, ces demandes ne peuvent pas être traitées.</p>
          <h2>Base légale et destinataires</h2>
          <p>Le traitement des inscriptions et messages repose sur votre consentement, donné en cochant la case correspondante. Les nouvelles du projet reposent sur un consentement séparé. Seules les personnes chargées du projet et les prestataires techniques nécessaires à l’hébergement et au stockage ont accès aux données selon leurs rôles.</p>
          <h2>Durée de conservation</h2>
          <p>Les demandes d’inscription sont conservées jusqu’à la fin du recrutement du pilote, ou jusqu’au retrait de votre consentement. Les messages sont conservés pendant le temps nécessaire à leur traitement, puis supprimés. Une durée maximale chiffrée et sa procédure opérationnelle seront arrêtées avant l’ouverture publique.</p>
          <h2>Vos droits</h2>
          <p>Vous pouvez demander l’accès, la rectification, l’effacement et, selon votre situation, la limitation ou la portabilité de vos données, et retirer votre consentement à tout moment via le <Link href="/contact">formulaire de contact</Link>. Vous pouvez aussi déposer une réclamation auprès de la <a href="https://www.cnil.fr/" target="_blank" rel="noreferrer">CNIL</a>.</p>
          <h2>Hébergement et transferts</h2>
          <p>Le stockage prévu utilise un projet Supabase situé dans l’Union européenne. Le choix de l’hébergeur du site et les éventuels transferts techniques doivent être vérifiés avant une ouverture publique ; cette page sera actualisée avec les informations définitives.</p>
          <h2>Cookies</h2>
          <p>Le site ne met pas en place de suivi publicitaire ou d’analyse d’audience. Les fonctions techniques strictement nécessaires peuvent utiliser des mécanismes de session selon l’hébergeur retenu.</p>
        </div>
      </div>
    </section>
  );
}
