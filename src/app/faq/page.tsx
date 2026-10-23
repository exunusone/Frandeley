import Link from "next/link";
import { faq } from "@/lib/content";
import { InnerHero } from "@/components/inner-hero";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Questions fréquentes", "Les réponses sur le pilote Frandeley, le stade du projet, les tarifs et la gestion de vos informations.", "/faq");

export default function FaqPage() {
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
          <div className="faq-intro"><span className="eyebrow">Questions fréquentes</span><h2>En toute clarté<span className="dot">.</span></h2><p>Frandeley est un concept en validation. Les détails du pilote seront précisés avant tout essai. Les règles de conservation et l’option e-mail sont expliquées dans la politique de confidentialité.</p><Link className="text-link faq-privacy-link" href="/confidentialite">Lire la politique de confidentialité <span aria-hidden="true">↗</span></Link></div>
          <div className="faq-list">
            {(["Le concept", "Le pilote", "Vos données"] as const).map((category) => (
              <section className="faq-group" key={category} aria-labelledby={`faq-${category.replaceAll(" ", "-").toLowerCase()}`}>
                <h3 id={`faq-${category.replaceAll(" ", "-").toLowerCase()}`}>{category}</h3>
                {faq.filter((item) => item.category === category).map((item, index) => (
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
