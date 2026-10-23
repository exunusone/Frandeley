"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export function ContactForm({ serverStatus }: { serverStatus?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(serverStatus === "envoye" ? "success" : serverStatus ? "error" : "idle");
  const [error, setError] = useState(serverStatus === "invalide" ? "Vérifiez les champs requis et votre consentement." : serverStatus === "indisponible" ? "Le contact est momentanément indisponible. Réessayez plus tard." : "");
  const [startedAt] = useState(() => Date.now());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setState("loading");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fields.get("name") || "").trim(),
          email: String(fields.get("email") || "").trim(),
          subject: String(fields.get("subject") || ""),
          message: String(fields.get("message") || "").trim(),
          consent: fields.get("consent") === "on",
          website: String(fields.get("website") || ""),
          startedAt,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Le message n’a pas pu être envoyé.");
      setState("success");
      form.reset();
    } catch (cause) {
      setState("error");
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue.");
    }
  }

  if (state === "success") return (
    <div className="form-success standalone" role="status">
      <span className="success-mark" aria-hidden="true">✓</span>
      <h2>Message reçu.</h2>
      <p>Merci de nous avoir écrit. Votre demande a été enregistrée.</p>
      <button type="button" className="text-link" onClick={() => setState("idle")}>Envoyer un autre message <span aria-hidden="true">↗</span></button>
    </div>
  );

  return (
    <form className="pilot-form standalone" onSubmit={submit} method="post" action="/api/contact" id="formulaire">
      <div className="form-grid">
        <div className="field"><label htmlFor="contact-name">Votre nom *</label><input id="contact-name" name="name" autoComplete="name" maxLength={100} required /></div>
        <div className="field"><label htmlFor="contact-email">Votre e-mail *</label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required /></div>
      </div>
      <div className="field">
        <label htmlFor="contact-subject">Sujet *</label>
        <select id="contact-subject" name="subject" required defaultValue="">
          <option value="" disabled>Choisissez un sujet</option>
          <option value="pilote">Le pilote</option>
          <option value="partenariat">Partenariat</option>
          <option value="donnees">Mes données personnelles</option>
          <option value="autre">Autre question</option>
        </select>
      </div>
      <div className="field"><label htmlFor="contact-message">Votre message *</label><textarea id="contact-message" name="message" rows={6} minLength={10} maxLength={3000} required placeholder="Votre message…" /></div>
      <div className="trap" aria-hidden="true"><label htmlFor="contact-website">Site web</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="check-row">
        <input id="contact-consent" name="consent" type="checkbox" required />
        <span className="check-copy"><label htmlFor="contact-consent">J’accepte que ces informations soient traitées pour répondre à ma demande conformément à la politique de confidentialité.</label> <Link href="/confidentialite">Lire la politique de confidentialité</Link>. *</span>
      </div>
      {state === "error" && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="button form-submit" disabled={state === "loading"}>{state === "loading" ? "Envoi…" : "Envoyer le message"} <span aria-hidden="true">↗</span></button>
    </form>
  );
}
