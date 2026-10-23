import Link from "next/link";
import { faq } from "@/lib/content";
import { InnerHero } from "@/components/inner-hero";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Questions fréquentes", "Les réponses sur le pilote Frandeley, le stade du projet, les tarifs et la gestion de vos informations.", "/faq");

export default function FaqPage() {
  const categories = [
    { label: "Le concept", id: "faq-le-concept", detail: "L’idée, le stade du projet et les fonctions envisagées." },
    { label: "Le pilote", id: "faq-le-pilote", detail: "Les échanges, l’inscription et les prochaines étapes." },
    { label: "Vos données", id: "faq-vos-donnees", detail: "La collecte, la newsletter et vos droits." },
  ] as const;

  return (
    <>
      <InnerHero
        number="04 — FAQ"
        title={<>Les questions<br />avant la première prise<span className="dot">.</span></>}
        description="Ce que nous savons aujourd’hui, et ce qu’il reste à vérifier avec les artistes."
        image="/images/notebook.webp"
        alt="Carnet et casque dans un espace de création musicale"
      />
      <section className="section-space">
        <div className="shell faq-layout">
          <div className="faq-intro">
            <span className="eyebrow">Questions fréquentes</span>
            <h2>En toute clarté<span className="dot">.</span></h2>
            <p>Frandeley est un concept en validation. Les détails du pilote seront précisés avant tout essai. Les règles de conservation et l’option e-mail sont expliquées dans la politique de confidentialité.</p>
            <Link className="text-link faq-privacy-link" href="/confidentialite">Lire la politique de confidentialité <span aria-hidden="true">↗</span></Link>
            <nav className="faq-topic-nav" aria-label="Accès rapide aux questions">
              {categories.map((category, index) => (
                <a href={`#${category.id}`} key={category.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span><strong>{category.label}</strong><small>{category.detail}</small></span>
                  <span aria-hidden="true">↘</span>
                </a>
              ))}
            </nav>
            <div className="faq-key-note"><strong>Le repère essentiel</strong>Votre inscription manifeste un intérêt ; elle ne crée pas de compte et ne garantit pas une place au pilote.</div>
          </div>
          <div className="faq-list">
            {categories.map((category) => (
              <section className="faq-group" id={category.id} key={category.id} aria-labelledby={`${category.id}-heading`}>
                <h3 id={`${category.id}-heading`}>{category.label}</h3>
                {faq.filter((item) => item.category === category.label).map((item, index) => (
                  <details key={item.question} className="faq-item">
                    <summary><span>{String(index + 1).padStart(2, "0")}</span>{item.question}<b aria-hidden="true">+</b></summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </section>
            ))}
            <p className="faq-more">Une autre question ? <Link href="/contact">Écrivez-nous <span aria-hidden="true">↗</span></Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
