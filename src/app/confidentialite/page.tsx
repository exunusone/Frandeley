import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Confidentialité", "Informations sur la collecte et l’utilisation des données personnelles sur le site Frandeley.", "/confidentialite");

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
          <p>Le traitement des inscriptions et messages repose sur votre consentement, donné en cochant la case correspondante. Les nouvelles du projet reposent sur un consentement séparé. Seules les personnes chargées du projet et les prestataires techniques nécessaires au fonctionnement du site ont accès aux données selon leurs rôles. Si vous cochez l’option facultative, votre adresse e-mail est transmise à Mailchimp pour gérer la confirmation d’abonnement et l’envoi des nouvelles de Frandeley. Elle n’est pas transmise à Mailchimp si vous ne cochez pas cette option.</p>
          <h2>Durée de conservation</h2>
          <p>Les demandes au pilote et les messages de contact sont supprimés automatiquement de Supabase au plus tard 12 mois après leur envoi. Vous pouvez demander leur effacement plus tôt. Si vous vous abonnez aux nouvelles de Frandeley, Mailchimp conserve les informations nécessaires à la gestion de votre abonnement tant que celui-ci est actif ; vous pouvez vous désabonner à tout moment avec le lien présent dans chaque e-mail. Le désabonnement n’annule pas votre demande au pilote.</p>
          <h2>Vos droits</h2>
          <p>Vous pouvez demander l’accès, la rectification, l’effacement et, selon votre situation, la limitation ou la portabilité de vos données, et retirer votre consentement à tout moment via le <Link href="/contact">formulaire de contact</Link>. Vous pouvez aussi déposer une réclamation auprès de la <a href="https://www.cnil.fr/" target="_blank" rel="noreferrer">CNIL</a>.</p>
          <h2>Hébergement et transferts</h2>
          <p>Les formulaires transitent par des fonctions hébergées sur Vercel, configurées dans la région de Paris (cdg1). Les demandes de pilote et les messages de contact sont stockés dans un projet Supabase situé dans l’Union européenne (eu-west-1, Irlande). Si vous choisissez les nouvelles par e-mail, votre adresse est aussi traitée par Mailchimp selon ses conditions et sa notice de confidentialité ; Mailchimp peut traiter des données en dehors de l’Espace économique européen. Consultez <a href="https://mailchimp.com/legal/privacy/" target="_blank" rel="noreferrer">la notice de confidentialité de Mailchimp</a> pour ses informations sur les traitements et les transferts.</p>
          <h2>Cookies</h2>
          <p>Le site ne met pas en place de suivi publicitaire ou d’analyse d’audience. Il ne propose pas de compte utilisateur ; les prestataires peuvent traiter les données techniques nécessaires à la sécurité et au fonctionnement de l’hébergement.</p>
        </div>
      </div>
    </section>
  );
}
