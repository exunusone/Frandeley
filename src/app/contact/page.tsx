import { ContactForm } from "@/components/contact-form";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("Contact", "Contactez l’équipe Frandeley au sujet du pilote, d’un partenariat ou de vos données.", "/contact");

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  return (
    <section className="section-space top-page">
      <div className="shell contact-layout">
        <div>
          <span className="eyebrow">05 / CONTACT</span>
          <h1>On reste<br />à l’écoute<span className="dot">.</span></h1>
          <p>Une question sur le pilote, une idée ou une demande concernant vos données ? Écrivez-nous ici.</p>
          <div className="contact-divider" />
          <p className="muted">Ce formulaire enregistre votre message afin que l’équipe Frandeley puisse le traiter. Aucun compte n’est nécessaire.</p>
        </div>
        <ContactForm serverStatus={status} />
      </div>
    </section>
  );
}
