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
        <p className="legal-intro">Cette page décrit les informations recueillies par le site de prélancement Frandeley. Dernière mise à jour : 24 octobre 2026.</p>
        <div className="privacy-summary" aria-label="Résumé des principaux traitements">
          <article><span>01 / PILOTE</span><h2>Vos informations écrites</h2><p>Nom d’artiste et e-mail lorsque les candidatures sont ouvertes. Pratique et description d’un morceau facultatives.</p></article>
          <article><span>02 / NOUVELLES</span><h2>Une option séparée</h2><p>La newsletter est facultative. Votre e-mail est ajouté à la liste Resend uniquement après votre confirmation.</p></article>
          <article><span>03 / INTÉRÊT</span><h2>Sans e-mail</h2><p>Un identifiant aléatoire du navigateur empêche les doublons. Le compteur ne certifie pas un nombre de personnes uniques.</p></article>
        </div>
        <p className="privacy-summary-note">Ce résumé facilite la lecture. Les précisions, vos droits et les coordonnées de contact figurent ci-dessous.</p>
        <div className="legal-layout">
          <LegalIndex label="Sommaire de la politique de confidentialité" items={privacySections} />
          <div className="legal-content">
            <h2 id="privacy-contact">Responsable et contact</h2>
            <p>Le projet Frandeley est porté par Djeferson Exunus. Pour une question ou l’exercice de vos droits, utilisez le <Link href="/contact">formulaire de contact</Link> en choisissant « Mes données personnelles ».</p>
            <h2 id="privacy-data">Données et finalités</h2>
            <p>Lorsque les candidatures au pilote sont ouvertes, le formulaire recueille le nom d’artiste et l’adresse e-mail obligatoires, ainsi que, si vous les fournissez, votre pratique et quelques mots sur un morceau. Ces informations servent à organiser les échanges et essais du pilote. La case facultative « nouvelles du projet » permet de recevoir des informations sur Frandeley. Aucun paiement n’est collecté et aucun fichier audio n’est demandé par ce site.</p>
            <p>Le bouton « Je suis intéressé·e » ne demande ni nom ni adresse e-mail. Au premier clic, le navigateur crée un identifiant aléatoire conservé localement pendant un an. Le serveur transforme cet identifiant en empreinte avant de l’enregistrer dans Supabase ; l’identifiant brut et l’adresse IP ne sont pas enregistrés par cette fonction. Cette empreinte sert à éviter les doublons et à mettre à jour le compteur. Le nombre affiché correspond à des navigateurs ayant manifesté leur intérêt, pas à un nombre vérifié d’artistes ou de personnes uniques. Vous pouvez retirer votre choix depuis le même navigateur avec le bouton « Annuler mon intérêt ».</p>
            <p>Le formulaire de contact recueille votre nom, votre e-mail, le sujet et le contenu du message pour y répondre. Sans les champs obligatoires, ces demandes ne peuvent pas être traitées.</p>
            <h2 id="privacy-basis">Base légale et destinataires</h2>
            <p>Le traitement des candidatures et messages repose sur votre consentement, donné en cochant la case correspondante. Le clic sur le bouton d’intérêt exprime votre choix de figurer une fois dans le compteur ; Cloudflare Turnstile effectue une vérification anti-robot. Les nouvelles du projet reposent sur un consentement séparé. Resend traite le nom d’artiste et l’adresse e-mail de chaque nouvelle demande au pilote pour envoyer une notification opérationnelle à l’équipe du projet ; cette notification ne vaut pas inscription aux nouvelles. Pour recevoir les nouvelles, votre adresse e-mail n’est ajoutée à la liste Resend que si vous cochez l’option facultative puis confirmez votre adresse depuis l’e-mail reçu.</p>
            <h2 id="privacy-retention">Durée de conservation</h2>
            <p>Les candidatures au pilote, les messages de contact et les empreintes utilisées pour dédoublonner les marques d’intérêt sont supprimés automatiquement de Supabase au plus tard 12 mois après leur enregistrement. Le compteur est recalculé après cette suppression quotidienne. Vous pouvez aussi retirer votre marque d’intérêt immédiatement avec le bouton « Annuler mon intérêt » depuis le même navigateur. Si vous confirmez votre abonnement aux nouvelles de Frandeley, l’adresse e-mail et la date de confirmation sont conservées dans Supabase selon cette durée, et Resend conserve les informations nécessaires à la gestion de l’abonnement tant qu’il est actif ; vous pouvez vous désabonner à tout moment avec le lien présent dans chaque e-mail. Les journaux des notifications opérationnelles sont traités selon les règles de Resend. Le désabonnement n’annule pas votre demande au pilote.</p>
            <h2 id="privacy-rights">Vos droits</h2>
            <p>Vous pouvez retirer votre marque d’intérêt depuis le même navigateur. Vous pouvez demander l’accès, la rectification, l’effacement et, selon votre situation, la limitation ou la portabilité de vos autres données via le <Link href="/contact">formulaire de contact</Link>. Vous pouvez aussi déposer une réclamation auprès de la <a href="https://www.cnil.fr/" target="_blank" rel="noreferrer">CNIL</a>.</p>
            <h2 id="privacy-hosting">Hébergement et transferts</h2>
            <p>Les formulaires transitent par des fonctions hébergées sur Vercel, configurées dans la région de Paris (cdg1). Les candidatures, messages et empreintes du compteur sont stockés dans un projet Supabase situé dans l’Union européenne (eu-west-1, Irlande). Cloudflare Turnstile effectue la vérification anti-robot ; consultez sa <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">politique de confidentialité</a> pour les traitements techniques associés. Resend intervient pour l’envoi des confirmations, des nouvelles choisies et des notifications opérationnelles, selon ses conditions et sa <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noreferrer">politique de confidentialité</a>.</p>
            <h2 id="privacy-cookies">Cookies</h2>
            <p>Le site ne met pas en place de suivi publicitaire ou d’analyse d’audience et ne propose pas de compte utilisateur. Le bouton d’intérêt utilise le stockage local du navigateur uniquement pour empêcher les votes répétés et permettre de retirer ce choix ; cet identifiant expire au bout d’un an. Cloudflare charge le module Turnstile au moment de la vérification anti-robot.</p>
            <h2 id="privacy-help">Une question ou une demande ?</h2>
            <p>Utilisez le <Link href="/contact">formulaire de contact</Link> et choisissez « Mes données personnelles ». Pour une question générale sur le projet, la <Link href="/faq">FAQ</Link> précise le fonctionnement des inscriptions et de la liste d’intérêt.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
