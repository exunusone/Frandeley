import { InnerHero } from "@/components/inner-hero";
import { PilotForm } from "@/components/pilot-form";
import { isMailchimpConfigured } from "@/lib/mailchimp";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Rejoindre le pilote", "Artiste indépendant avec un morceau en cours ? Inscrivez-vous à la liste d’intérêt du pilote Frandeley.", "/pilote");

export default async function PilotePage({ searchParams }: { searchParams: Promise<{ status?: string; newsletter?: string }> }) {
  const { status, newsletter } = await searchParams;
  return (
    <>
      <InnerHero
        number="03 — PILOTE"
        title={<>La suite s’écrit<br />avec les artistes<span className="dot">.</span></>}
        description="Nous préparons un pilote limité pour confronter le parcours Frandeley aux habitudes de création d’artistes indépendants."
        image="/images/stage.webp"
        alt="Guitariste face au public sur une scène éclairée en bleu"
      />
      <section className="section-space pilot-explainer">
        <div className="shell editorial-grid">
          <div data-reveal><span className="eyebrow">À qui nous pensons</span><h2>Vous avez un morceau en cours<span className="dot">.</span></h2></div>
          <div className="editorial-body" data-reveal>
            <p>Vous créez ou enregistrez régulièrement sur téléphone. Vous préparez vos sorties seul, en collectif ou avec une petite équipe. Vous aimeriez retrouver plus facilement vos prises, vos versions et les décisions autour d’un morceau.</p>
            <p>Votre genre musical, votre audience et votre expérience ne déterminent pas l’intérêt de votre retour. Ce qui compte : un projet réel à reprendre, partager ou sortir.</p>
          </div>
        </div>
      </section>
      <section className="principles-section section-space">
        <div className="shell">
          <div className="section-topline"><span>COMMENT SE DÉROULERA LE PILOTE</span><span>01 — 03</span></div>
          <div className="principle-list">
            <article data-reveal><span>01</span><h3>Échanger</h3><p>Comprendre comment vous avancez sur un morceau avec vos outils actuels.</p></article>
            <article data-reveal><span>02</span><h3>Essayer</h3><p>Tester un parcours restreint, de la capture à une démo retrouvée et partagée.</p></article>
            <article data-reveal><span>03</span><h3>Décider</h3><p>Mesurer ensemble ce qui a aidé, ce qui bloque encore et ce qu’il faut changer.</p></article>
          </div>
        </div>
      </section>
      <section className="section-space" id="inscription">
        <div className="shell pilot-entry">
          <div className="pilot-entry-copy" data-reveal>
            <span className="eyebrow">Inscription au pilote</span>
            <h2>Parlez-nous de votre musique<span className="dot">.</span></h2>
            <p>Laissez vos coordonnées et quelques mots sur votre pratique. L’inscription n’engage à rien et ne garantit pas une place. Aucun lancement ni calendrier de sélection n’est annoncé à ce stade.</p>
            <div className="pilot-aside"><span>01</span> Inscription gratuite<br /><span>02</span> Échanges si votre profil correspond<br /><span>03</span> Conditions présentées avant tout test</div>
          </div>
          <PilotForm variant="standalone" serverStatus={status} newsletterEnabled={isMailchimpConfigured()} serverNewsletterStatus={newsletter} />
        </div>
      </section>
    </>
  );
}
