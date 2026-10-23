import Image from "next/image";
import { InnerHero } from "@/components/inner-hero";
import { SectionCta } from "@/components/section-cta";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Le parcours du morceau", "Les quatre étapes du parcours Frandeley envisagé : capturer une idée, organiser les versions, recueillir des retours et préparer une sortie.", "/parcours");

const chapters = [
  {
    id: "capture",
    number: "01",
    label: "CAPTURE",
    title: "Le début tient dans la poche",
    copy: "Une voix, un rythme, une mélodie ou quelques mots. La première prise doit être facile à enregistrer, à nommer et à retrouver, même après une interruption.",
    detail: "À tester : une capture mobile simple et fiable, y compris hors réseau.",
    image: "/images/capture.webp",
    alt: "Artiste enregistrant une idée musicale sur téléphone",
  },
  {
    id: "creation",
    number: "02",
    label: "CRÉATION",
    title: "Les versions racontent la progression",
    copy: "Les prises alternatives, paroles et notes se rattachent au morceau. L’artiste peut revenir sur son travail et identifier clairement la démo qu’il choisit d’exporter.",
    detail: "À tester : retrouver la bonne version et exporter une démo identifiable.",
    image: "/images/partager.webp",
    alt: "Artiste écoutant les versions de son projet musical sur ordinateur",
  },
  {
    id: "retours",
    number: "03",
    label: "ÉCOUTE",
    title: "Un retour, sur la bonne version",
    copy: "Un partage privé peut donner du sens aux retours. Chaque commentaire doit désigner la version entendue, pour éviter que les décisions se perdent dans les messages.",
    detail: "À tester : partager et comprendre les retours sans ambiguïté.",
    image: "/images/mobile-web.webp",
    alt: "Téléphone et ordinateur montrant un même projet musical",
  },
  {
    id: "sortie",
    number: "04",
    label: "PRÉPARATION",
    title: "La suite se prépare sans précipitation",
    copy: "Crédits, visuels, fichiers et prochaines tâches peuvent se réunir dans une vue web. L’artiste vérifie ce qui est prêt et choisit ce qu’il rend public.",
    detail: "À tester : préparer une sortie sans reconstituer le dossier ailleurs.",
    image: "/images/notebook.webp",
    alt: "Carnet de création avec notes de musique dans un studio",
  },
];

export default function ParcoursPage() {
  return (
    <>
      <InnerHero
        number="02 — PARCOURS"
        title={<>Un morceau.<br />Un fil à garder<span className="dot">.</span></>}
        description="Quatre moments à relier, de l’idée enregistrée sur téléphone jusqu’aux éléments de sortie préparés."
        image="/images/mobile-web.webp"
        alt="Téléphone et ordinateur dans un studio musical"
      />
      <nav className="chapter-nav shell" aria-label="Étapes du parcours">
        {chapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`}><span>{chapter.number}</span>{chapter.label}</a>)}
      </nav>
      {chapters.map((chapter, index) => (
        <section id={chapter.id} className={`chapter ${index % 2 ? "chapter-reverse" : ""}`} key={chapter.id}>
          <div className="chapter-media"><Image src={chapter.image} alt={chapter.alt} fill sizes="(max-width: 850px) 100vw, 50vw" /></div>
          <div className="chapter-copy" data-reveal>
            <span className="eyebrow">{chapter.number} / {chapter.label}</span>
            <h2>{chapter.title}<span className="dot">.</span></h2>
            <p>{chapter.copy}</p>
            <div className="chapter-detail">{chapter.detail}</div>
          </div>
        </section>
      ))}
      <section className="measurement-section section-space" aria-labelledby="measurement-title">
        <div className="shell">
          <div className="section-topline"><span>LES REPÈRES DU PILOTE</span><span>DES INDICATEURS À TESTER</span></div>
          <div className="section-heading-row" data-reveal>
            <h2 id="measurement-title">La continuité doit se voir dans l’usage<span className="dot">.</span></h2>
            <p>Le parcours devra aider sur un morceau réel. Ces repères sont proposés pour orienter les essais, sans résultats annoncés.</p>
          </div>
          <div className="measurement-grid" data-reveal-stagger>
            <article data-reveal><span>01 / ACTIVATION</span><h3>Retrouver une prise</h3><p>La première capture reste identifiable et peut être reprise après une interruption.</p></article>
            <article data-reveal><span>02 / VALEUR</span><h3>Partager une démo</h3><p>Une version peut être exportée ou partagée sans reconstruire son contexte ailleurs.</p></article>
            <article data-reveal><span>03 / RETOUR</span><h3>Revenir au morceau</h3><p>L’artiste reprend le projet plus tard et peut avancer vers un second morceau.</p></article>
          </div>
          <p className="concept-disclaimer">Le pilote devra aussi mesurer les blocages, le temps passé et les coûts variables liés aux médias et à une éventuelle IA.</p>
        </div>
      </section>
      <section className="text-cta section-space">
        <div className="shell" data-reveal>
          <span className="eyebrow">Votre pratique compte</span>
          <h2>Quel moment de ce parcours vous freine aujourd’hui<span className="dot"> ?</span></h2>
          <p>Le pilote servira à vérifier ce qui aide vraiment, sur des morceaux réels.</p>
          <SectionCta />
        </div>
      </section>
    </>
  );
}
