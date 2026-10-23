import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Contact", "Une question sur le pilote Frandeley, une proposition de partenariat ou une demande concernant vos données ? Écrivez à l’équipe.", "/contact");

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  return (
    <section className="section-space top-page">
      <div className="shell contact-layout">
        <div className="contact-intro">
          <span className="eyebrow">05 / CONTACT</span>
          <h1>On reste<br />à l’écoute<span className="dot">.</span></h1>
          <p>Une question sur le pilote, une idée ou une demande concernant vos données ? Écrivez-nous ici.</p>
          <div className="contact-visual" data-reveal>
            <Image src="/images/artists-collaborating.webp" alt="Des artistes échangent autour d’un morceau en studio." fill sizes="(max-width: 850px) 100vw, 38vw" />
            <span>Le dialogue commence par votre pratique.</span>
          </div>
          <div className="contact-topics" data-reveal-stagger>
            <article data-reveal><span>01 / PILOTE</span><p>Racontez-nous un besoin rencontré sur un morceau en cours.</p></article>
            <article data-reveal><span>02 / PARTENARIAT</span><p>Présentez votre proposition et les artistes concernés.</p></article>
            <article data-reveal><span>03 / DONNÉES</span><p>Choisissez ce sujet pour demander l’accès, la correction ou l’effacement.</p></article>
          </div>
          <p className="contact-data-note">Le formulaire ne permet pas l’envoi de fichier. Ne joignez pas de démo ou de document confidentiel.</p>
        </div>
        <div className="contact-form-column">
          <span className="eyebrow">Écrivez à l’équipe</span>
          <h2>Comment pouvons-nous vous aider<span className="dot"> ?</span></h2>
          <p>Votre message est enregistré afin que l’équipe Frandeley puisse le traiter. Aucun compte n’est nécessaire.</p>
          <ContactForm serverStatus={status} />
          <p className="contact-privacy-link">Le détail du traitement figure dans la <Link href="/confidentialite">politique de confidentialité</Link>.</p>
        </div>
      </div>
    </section>
  );
}
