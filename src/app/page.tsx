import Image from "next/image";
import Link from "next/link";
import { steps } from "@/lib/content";
import { PilotForm } from "@/components/pilot-form";
import { SectionCta } from "@/components/section-cta";
import { WaveRail } from "@/components/wave-rail";

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
          <div className="section-topline"><span>UN MÊME PROJET. TROIS TEMPS.</span><span>01 — 03</span></div>
          <div className="section-heading-row" data-reveal>
            <h2>Un morceau avance<br />quand tout reste lié<span className="dot">.</span></h2>
            <p>Chaque étape a sa place. Le parcours est pensé pour que l’idée d’aujourd’hui reste utile demain.</p>
          </div>
          <div className="steps-grid">
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

      <section className="research-section section-space">
        <div className="shell research-panel">
          <div className="research-lead" data-reveal>
            <span className="eyebrow">Les questions du pilote</span>
            <h2>Avant les outils,<br />écouter les artistes<span className="dot">.</span></h2>
            <p>Frandeley part d’un parcours imaginé. Le pilote servira à comprendre ce qui aide vraiment — et ce qui mérite d’être repensé.</p>
            <Link className="text-link" href="/pilote">Comprendre le pilote <span aria-hidden="true">↗</span></Link>
          </div>
          <ol className="research-list">
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
              <h2>Faites partie des premiers artistes à l’essayer<span className="dot">.</span></h2>
              <p>Nous préparons un pilote avec un groupe restreint d’artistes. Parlez-nous de votre pratique pour être informé des prochaines étapes.</p>
              <PilotForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
