import Image from "next/image";
import Link from "next/link";
import { steps } from "@/lib/content";
import { PilotForm } from "@/components/pilot-form";
import { SectionCta } from "@/components/section-cta";
import { WaveRail } from "@/components/wave-rail";
import { isResendNewsletterConfigured } from "@/lib/resend";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Studio musical en préparation pour artistes indépendants",
  "Découvrez Frandeley, un concept qui relie les prises, versions, retours et éléments de sortie d’un morceau. Inscrivez-vous pour contribuer au pilote.",
  "/",
);

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <Image src="/images/hero-session.webp" alt="Musicienne enregistrant une idée à la guitare dans son studio" fill priority sizes="100vw" className="hero-photo" />
        <div className="hero-shade" />
        <div className="shell hero-content">
          <h1>Une idée.<br />Un morceau.<br />La suite<span className="dot">.</span></h1>
          <p>Le même projet, du premier enregistrement sur votre téléphone jusqu’à la démo et à la sortie préparée.</p>
          <SectionCta />
        </div>
        <div className="shell hero-bottom">
          <WaveRail />
        </div>
      </section>

      <section className="prelaunch-note" aria-label="État du projet Frandeley">
        <div className="shell prelaunch-note-inner">
          <span className="prelaunch-status"><span aria-hidden="true" />Concept en validation</span>
          <p><strong>Frandeley n’est pas encore disponible.</strong> Nous préparons un pilote avec des artistes ; l’inscription signale votre intérêt sans créer de compte.</p>
          <Link href="/faq">Où en est le projet ? <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="feature-story">
        <Image src="/images/mobile-web.webp" alt="Téléphone et ordinateur montrant un projet musical organisé" fill sizes="100vw" className="feature-photo" />
        <div className="feature-shade" />
        <div className="shell feature-copy" data-reveal>
          <span className="eyebrow">Un seul projet, du mobile au web</span>
          <h2>Du téléphone<br />à la sortie,<br />sans perdre l’élan<span className="dot">.</span></h2>
          <p>Une prise, une version, un retour, une décision. Frandeley explore une façon de garder le fil du même morceau à chaque étape de sa création.</p>
          <Link href="/vision" className="text-link">Découvrir la vision <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="steps-section section-space">
        <div className="shell">
          <div className="section-topline"><span>UN MÊME PROJET. QUATRE TEMPS.</span><span>01 — 04</span></div>
          <div className="section-heading-row" data-reveal>
            <h2>Un morceau avance<br />quand tout reste lié<span className="dot">.</span></h2>
            <p>Chaque étape a sa place. Le parcours est pensé pour que l’idée d’aujourd’hui reste utile demain.</p>
          </div>
          <div className="steps-grid" data-reveal-stagger>
            {steps.map((step) => (
              <article className="step" key={step.number} data-reveal>
                <div className="step-image"><Image src={step.image} alt={step.alt} fill sizes="(max-width: 800px) 100vw, 33vw" /></div>
                <div className="step-title-row"><span>{step.number}</span><h3>{step.title}</h3></div>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
          <Link className="text-link under-grid" href="/parcours">Explorer le parcours complet <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="film-section section-space" aria-labelledby="film-title">
        <div className="shell film-grid">
          <div className="film-copy" data-reveal>
            <span className="eyebrow">Le fil d’un morceau · 20 secondes</span>
            <h2 id="film-title">Une idée ne tient pas dans un seul fichier<span className="dot">.</span></h2>
            <p>Une prise devient une démo, les retours font avancer le titre, puis l’artiste prépare la suite à son rythme. Cette vidéo résume l’intention que Frandeley veut explorer avec des artistes indépendants.</p>
            <p className="film-note" id="film-description">Vidéo muette avec textes à l’écran et images d’illustration. Elle présente un concept en validation, pas une interface disponible.</p>
            <Link className="text-link" href="/vision">Lire la vision complète <span aria-hidden="true">↗</span></Link>
          </div>
          <figure className="film-figure" data-reveal>
            <div className="film-screen">
              <video
                controls
                playsInline
                preload="none"
                poster="/images/artists-collaborating.webp"
                aria-describedby="film-description"
                aria-label="Film de présentation muet de Frandeley, d’une durée de 20 secondes"
              >
                <source src="/videos/frandeley-prelaunch-film.mp4" type="video/mp4" />
                Votre navigateur ne peut pas lire cette vidéo. Le texte de présentation est disponible à côté.
              </video>
            </div>
            <figcaption><span>20 s · sans son</span><span>Concept en validation</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="song-core-section section-space">
        <div className="shell">
          <div className="section-topline"><span>LE MORCEAU COMME DOSSIER VIVANT</span><span>CRÉER / RELIER / PRÉPARER</span></div>
          <div className="section-heading-row" data-reveal>
            <h2>Garder la matière et les décisions au même endroit<span className="dot">.</span></h2>
            <p>Le concept Frandeley explore un fil continu entre ce que l’artiste crée, les personnes qui l’accompagnent et les éléments qui préparent la suite.</p>
          </div>
          <div className="song-core-grid" data-reveal-stagger>
            <article className="song-core-card" data-reveal>
              <span className="song-core-index">01 / CRÉATION</span>
              <h3>La matière du morceau</h3>
              <p>Prises, paroles, arrangements et exports resteraient reliés pour retrouver la progression sans fouiller plusieurs dossiers.</p>
            </article>
            <article className="song-core-card" data-reveal>
              <span className="song-core-index">02 / PERSONNES</span>
              <h3>Les retours et les rôles</h3>
              <p>Collaborateurs, commentaires et validations se rattacheraient à une version précise du morceau.</p>
            </article>
            <article className="song-core-card" data-reveal>
              <span className="song-core-index">03 / SORTIE</span>
              <h3>La préparation choisie</h3>
              <p>Crédits, visuels, métadonnées et prochaines tâches pourraient être réunis avant toute décision de publication.</p>
            </article>
          </div>
          <p className="concept-disclaimer">Ces pistes sont à vérifier avec les artistes pendant le pilote ; elles ne sont pas encore des fonctions disponibles.</p>
        </div>
      </section>

      <section className="research-section section-space">
        <div className="shell research-panel">
          <div className="research-lead" data-reveal>
            <span className="eyebrow">Les questions du pilote</span>
            <h2>Avant les outils,<br />écouter les artistes<span className="dot">.</span></h2>
            <p>Frandeley part d’un parcours imaginé. Le pilote servira à comprendre ce qui aide vraiment — et ce qui mérite d’être repensé.</p>
            <Link className="text-link" href="/pilote">Comprendre le pilote <span aria-hidden="true">↗</span></Link>
          </div>
          <ol className="research-list" data-reveal-stagger>
            <li data-reveal>
              <span>01</span>
              <div><h3>Retrouver une idée</h3><p>Comment reprenez-vous une prise enregistrée sur téléphone quand le morceau avance ?</p></div>
            </li>
            <li data-reveal>
              <span>02</span>
              <div><h3>Partager la bonne version</h3><p>De quoi avez-vous besoin pour envoyer une démo et recevoir des retours utiles ?</p></div>
            </li>
            <li data-reveal>
              <span>03</span>
              <div><h3>Préparer la suite</h3><p>Quelles décisions et informations vous manquent avant de préparer une sortie ?</p></div>
            </li>
          </ol>
        </div>
        <div className="shell research-disclaimer">Ce sont des questions de recherche, pas des fonctionnalités déjà disponibles.</div>
      </section>

      <section className="pilot-signals-section section-space" aria-labelledby="pilot-signals-title">
        <div className="shell">
          <div className="section-topline"><span>À QUOI SERVIRA LE PILOTE ?</span><span>APPRENDRE SUR UN MORCEAU RÉEL</span></div>
          <div className="section-heading-row" data-reveal>
            <h2 id="pilot-signals-title">Vérifier l’utilité, étape par étape<span className="dot">.</span></h2>
            <p>Nous voulons observer si le parcours imaginé aide vraiment les artistes, puis corriger ce qui ne fonctionne pas.</p>
          </div>
          <div className="pilot-signals-grid" data-reveal-stagger>
            <article data-reveal><span>01 / RETROUVER</span><h3>Reprendre une idée</h3><p>Une première prise reste identifiable après une pause et son contexte est facile à retrouver.</p></article>
            <article data-reveal><span>02 / PARTAGER</span><h3>Faire avancer la démo</h3><p>L’artiste peut choisir la bonne version et recueillir un retour compréhensible.</p></article>
            <article data-reveal><span>03 / CONTINUER</span><h3>Revenir au projet</h3><p>Le morceau garde assez de continuité pour que l’artiste poursuive son travail à son rythme.</p></article>
          </div>
          <div className="pilot-signals-foot"><p>Ces repères sont des hypothèses à tester. Aucun résultat de pilote n’est encore disponible.</p><Link className="text-link" href="/parcours">Voir les étapes et repères proposés <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section className="collaboration-section section-space" aria-labelledby="collaboration-title">
        <div className="shell collaboration-grid">
          <div className="collaboration-visual" data-reveal>
            <Image
              src="/images/artists-collaborating.webp"
              alt="Une artiste, un guitariste et un producteur écoutent ensemble une prise en studio."
              fill
              sizes="(max-width: 850px) 100vw, 50vw"
            />
            <span className="collaboration-visual-label">UN MORCEAU, PLUSIEURS REGARDS</span>
          </div>
          <div className="collaboration-copy" data-reveal>
            <span className="eyebrow">La musique se construit aussi à plusieurs</span>
            <h2 id="collaboration-title">Les retours avancent le morceau. L’artiste garde la direction<span className="dot">.</span></h2>
            <p>Un titre peut réunir des paroles, des idées, des prises et les savoir-faire de plusieurs personnes. Frandeley veut étudier comment garder les échanges près de la bonne version, sans imposer d’équipe ni de méthode de travail.</p>
            <ul className="collaboration-roles" aria-label="Exemples de rôles autour d’un morceau">
              <li>Artiste</li>
              <li>Co-auteur·ice</li>
              <li>Beatmaker</li>
              <li>Ingénieur·e du son</li>
              <li>Collaborateur·ice</li>
            </ul>
            <p className="concept-disclaimer">Ces rôles illustrent des situations possibles ; le pilote servira à vérifier les besoins réels.</p>
            <Link className="text-link" href="/pilote">Partager votre façon de créer <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="artist-control-section section-space">
        <div className="shell artist-control-grid">
          <div className="artist-control-lead" data-reveal>
            <span className="eyebrow">Un principe de conception</span>
            <h2>L’artiste garde la main<span className="dot">.</span></h2>
            <p>Le produit est encore à l’étude. Les choix de partage, de crédits et de publication devront rester explicites.</p>
          </div>
          <div className="artist-control-list" data-reveal-stagger>
            <article data-reveal><span>01</span><div><h3>Rien n’est publié automatiquement</h3><p>L’artiste choisit si une page ou un contenu devient public.</p></div></article>
            <article data-reveal><span>02</span><div><h3>Les crédits se vérifient avec les personnes concernées</h3><p>Une suggestion ne remplace pas la confirmation des rôles et des droits.</p></div></article>
            <article data-reveal><span>03</span><div><h3>L’IA, si elle est retenue, reste une aide</h3><p>Elle pourrait structurer des notes ou résumer des retours ; l’artiste vérifierait et modifierait chaque proposition.</p></div></article>
          </div>
          <p className="concept-disclaimer">Aucun morceau audio n’est demandé ni envoyé depuis ce site de prélancement.</p>
        </div>
      </section>

      <section className="notebook-section">
        <Image src="/images/notebook.webp" alt="Carnet de musique ouvert près d’un casque dans un studio" fill sizes="100vw" />
        <div className="notebook-shade" />
        <div className="shell notebook-content" data-reveal>
          <span className="eyebrow">Pensé pour ceux qui créent au quotidien</span>
          <h2>Des idées d’aujourd’hui<br />aux morceaux de demain<span className="dot">.</span></h2>
          <p>Pour les artistes indépendants qui capturent sur téléphone, reprennent leurs morceaux plus tard et préparent leur sortie à leur rythme.</p>
          <Link className="text-link" href="/pilote">Voir à qui s’adresse le pilote <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="signup-section section-space" id="inscription">
        <div className="shell">
          <div className="signup-frame">
            <div className="signup-photo">
              <Image src="/images/stage.webp" alt="Guitariste indépendant sur scène, vu de dos" fill sizes="(max-width: 850px) 100vw, 50vw" />
              <span>La suite s’écrit avec les artistes.</span>
            </div>
            <div className="signup-copy">
              <span className="eyebrow">Rejoignez le pilote Frandeley</span>
              <h2>Contribuez aux premiers retours<span className="dot">.</span></h2>
              <p>Nous préparons un pilote avec un groupe restreint d’artistes. Parlez-nous de votre pratique pour être informé des prochaines étapes. L’inscription ne garantit pas une place.</p>
              <PilotForm newsletterEnabled={isResendNewsletterConfigured()} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
