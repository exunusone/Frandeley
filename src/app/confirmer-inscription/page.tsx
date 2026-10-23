export const metadata = {
  title: "Confirmer votre inscription | Frandeley",
  robots: { index: false, follow: false },
};

export default async function ConfirmNewsletterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <section className="section-space top-page legal-page">
      <div className="shell" style={{ maxWidth: 720 }}>
        <span className="eyebrow">FRANDELEY / LES NOUVELLES</span>
        <h1>Confirmer votre inscription<span className="dot">.</span></h1>
        {token ? (
          <>
            <p className="legal-intro">Vous avez demandé à recevoir les nouvelles de Frandeley. Confirmez votre adresse pour finaliser l’inscription. Le lien expire après 24 heures.</p>
            <form action="/api/newsletter/confirm" method="post">
              <input type="hidden" name="token" value={token} />
              <button className="button" type="submit">Confirmer mon inscription <span aria-hidden="true">↗</span></button>
            </form>
            <p style={{ marginTop: 24 }}>Si vous n’êtes pas à l’origine de cette demande, vous pouvez fermer cette page. Votre adresse ne sera pas ajoutée.</p>
          </>
        ) : (
          <p className="legal-intro">Ce lien est incomplet. Retournez au <a href="/pilote#formulaire">formulaire du pilote</a> pour demander un nouvel e-mail de confirmation.</p>
        )}
      </div>
    </section>
  );
}
