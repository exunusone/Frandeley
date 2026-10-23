import Link from "next/link";
import { LegalIndex } from "@/components/legal-index";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Confidentialité", "Informations sur la collecte et l’utilisation des données personnelles sur le site Frandeley.", "/confidentialite");

const privacySections = [
  { id: "privacy-contact", title: "Responsable et contact" },
  { id: "privacy-data", title: "Données et finalités" },
  { id: "privacy-basis", title: "Base légale et destinataires" },
  { id: "privacy-retention", title: "Durée de conservation" },
  { id: "privacy-rights", title: "Vos droits" },
  { id: "privacy-hosting", title: "Hébergement et transferts" },
  { id: "privacy-cookies", title: "Cookies" },
  { id: "privacy-help", title: "Une question ou une demande ?" },
] as const;

export default function PrivacyPage() {
  return (
    <section className="section-space top-page legal-page">
      <div className="shell">
        <span className="eyebrow">INFORMATIONS / DONNÉES PERSONNELLES</span>
        <h1>Confidentialité<span className="dot">.</span></h1>
        <p className="legal-intro">Cette page décrit les informations recueillies par le site de prélancement Frandeley. Dernière mise à jour : 23 octobre 2026.</p>
        <div className="privacy-summary" aria-label="Résumé des principaux traitements">
          <article><span>01 / PILOTE</span><h2>Vos informations écrites</h2><p>Nom d’artiste et e-mail ; pratique et description d’un morceau facultatives. Aucun fichier audio n’est demandé.</p></article>
          <article><span>02 / NOUVELLES</span><h2>Une option séparée</h2><p>La newsletter est facultative. Votre e-mail n’est transmis à Brevo pour les nouvelles que si vous cochez cette option.</p></article>
          <article><span>03 / DURÉE</span><h2>Suppression sous 12 mois</h2><p>Les demandes pilote et messages de contact sont supprimés au plus tard 12 mois après leur envoi.</p></article>
        </div>
        <p className="privacy-summary-note">Ce résumé facilite la lecture. Les précisions, vos droits et les coordonnées de contact figurent ci-dessous.</p>
        <div className="legal-layout">
          <LegalIndex label="Sommaire de la politique de confidentialité" items={privacySections} />
          <div className="legal-content">
            <h2 id="privacy-contact">Responsable et contact</h2>
            <p>Le projet Frandeley est porté par Djeferson Exunus. Pour une question ou l’exercice de vos droits, utilisez le <Link href="/contact">formulaire de contact</Link> en choisissant « Mes données personnelles ».</p>
            <h2 id="privacy-data">Données et finalités</h2>
            <p>Le formulaire pilote recueille le nom d’artiste et l’adresse e-mail obligatoires, ainsi que, si vous les fournissez, votre pratique et quelques mots sur un morceau. Ces informations servent à gérer les manifestations d’intérêt et à organiser les échanges et essais du pilote. La case facultative « nouvelles du projet » permet de recevoir des informations sur Frandeley. Aucun paiement n’est collecté et aucun fichier audio n’est demandé par ce site.</p>
            <p>Le formulaire de contact recueille votre nom, votre e-mail, le sujet et le contenu du message pour y répondre. Sans les champs obligatoires, ces demandes ne peuvent pas être traitées.</p>
            <h2 id="privacy-basis">Base légale et destinataires</h2>
            <p>Le traitement des inscriptions et messages repose sur votre consentement, donné en cochant la case correspondante. Les nouvelles du projet reposent sur un consentement séparé. Brevo traite le nom d’artiste et l’adresse e-mail d’une nouvelle demande au pilote pour envoyer une notification opérationnelle à l’équipe du projet ; cette notification ne vaut pas inscription aux nouvelles. Pour recevoir les nouvelles, votre adresse e-mail n’est transmise à Brevo à cette fin que si vous cochez l’option facultative, puis confirmez votre adresse depuis l’e-mail reçu.</p>
            <h2 id="privacy-retention">Durée de conservation</h2>
            <p>Les demandes au pilote et les messages de contact sont supprimés automatiquement de Supabase au plus tard 12 mois après leur envoi. Vous pouvez demander leur effacement plus tôt. Si vous confirmez votre abonnement aux nouvelles de Frandeley, Brevo conserve les informations nécessaires à sa gestion tant que l’abonnement est actif ; vous pouvez vous désabonner à tout moment avec le lien présent dans chaque e-mail. Les journaux des notifications opérationnelles sont traités selon les règles de Brevo. Le désabonnement n’annule pas votre demande au pilote.</p>
            <h2 id="privacy-rights">Vos droits</h2>
            <p>Vous pouvez demander l’accès, la rectification, l’effacement et, selon votre situation, la limitation ou la portabilité de vos données, et retirer votre consentement à tout moment via le <Link href="/contact">formulaire de contact</Link>. Vous pouvez aussi déposer une réclamation auprès de la <a href="https://www.cnil.fr/" target="_blank" rel="noreferrer">CNIL</a>.</p>
            <h2 id="privacy-hosting">Hébergement et transferts</h2>
            <p>Les formulaires transitent par des fonctions hébergées sur Vercel, configurées dans la région de Paris (cdg1). Les demandes de pilote et les messages de contact sont stockés dans un projet Supabase situé dans l’Union européenne (eu-west-1, Irlande). Brevo intervient pour l’envoi des confirmations, des nouvelles choisies et des notifications opérationnelles, selon ses conditions et sa <a href="https://www.brevo.com/legal/privacypolicy/" target="_blank" rel="noreferrer">politique de confidentialité</a>. Consultez cette politique pour connaître les traitements et transferts associés à ses services.</p>
            <h2 id="privacy-cookies">Cookies</h2>
            <p>Le site ne met pas en place de suivi publicitaire ou d’analyse d’audience. Il ne propose pas de compte utilisateur ; les prestataires peuvent traiter les données techniques nécessaires à la sécurité et au fonctionnement de l’hébergement.</p>
            <h2 id="privacy-help">Une question ou une demande ?</h2>
            <p>Utilisez le <Link href="/contact">formulaire de contact</Link> et choisissez « Mes données personnelles ». Pour une question générale sur le projet, la <Link href="/faq">FAQ</Link> précise le fonctionnement des inscriptions et de la liste d’intérêt.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
