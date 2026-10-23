"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type FormState = "idle" | "loading" | "success" | "error";

export function PilotForm({ variant = "panel", serverStatus, newsletterEnabled = false, serverNewsletterStatus }: {
  variant?: "panel" | "standalone";
  serverStatus?: string;
  newsletterEnabled?: boolean;
  serverNewsletterStatus?: string;
}) {
  const [state, setState] = useState<FormState>(serverStatus === "envoye" ? "success" : serverStatus ? "error" : "idle");
  const [message, setMessage] = useState(
    serverStatus === "invalide" ? "Vérifiez les champs requis et votre consentement." :
    serverStatus === "indisponible" ? "L’inscription est momentanément indisponible. Réessayez plus tard." : ""
  );
  const [newsletterMessage, setNewsletterMessage] = useState(() => newsletterStatusMessage(serverNewsletterStatus));
  const [startedAt] = useState(() => Date.now());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("loading");
    setMessage("");
    const fields = new FormData(form);
    const body = {
      artistName: String(fields.get("artistName") || "").trim(),
      email: String(fields.get("email") || "").trim(),
      profile: String(fields.get("profile") || ""),
      project: String(fields.get("project") || "").trim(),
      consent: fields.get("consent") === "on",
      updates: fields.get("updates") === "on",
      website: String(fields.get("website") || ""),
      startedAt,
    };
    try {
      const response = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "L’inscription n’a pas pu être enregistrée.");
      setNewsletterMessage(newsletterStatusMessage(result.newsletterStatus));
      setState("success");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Une erreur est survenue.");
    }
  }

  if (state === "success") {
    return (
      <div className={`form-success ${variant}`} role="status">
        <span className="success-mark" aria-hidden="true">✓</span>
        <h3>Votre intérêt est enregistré.</h3>
        <p>Merci. Votre inscription à la liste du pilote a bien été reçue. Nous vous recontacterons si votre profil correspond aux premiers tests.</p>
        {newsletterMessage && <p className="newsletter-status" role="status">{newsletterMessage}</p>}
        <button className="text-link" onClick={() => setState("idle")} type="button">Inscrire un autre artiste <span aria-hidden="true">↗</span></button>
      </div>
    );
  }

  return (
    <form className={`pilot-form ${variant}`} onSubmit={submit} method="post" action="/api/inscription" id={variant === "standalone" ? "formulaire" : undefined}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor={`artistName-${variant}`}>Nom d’artiste <span aria-hidden="true">*</span></label>
          <input id={`artistName-${variant}`} name="artistName" type="text" autoComplete="nickname" maxLength={80} placeholder="Votre nom d’artiste" required />
        </div>
        <div className="field">
          <label htmlFor={`email-${variant}`}>Adresse e-mail <span aria-hidden="true">*</span></label>
          <input id={`email-${variant}`} name="email" type="email" autoComplete="email" maxLength={254} placeholder="vous@exemple.fr" required />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`profile-${variant}`}>Votre pratique</label>
        <select id={`profile-${variant}`} name="profile" defaultValue="">
          <option value="">Choisissez une réponse (facultatif)</option>
          <option value="solo">Je crée principalement en solo</option>
          <option value="collectif">Je crée avec un collectif ou un groupe</option>
          <option value="collaboration">Je collabore avec d’autres artistes</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor={`project-${variant}`}>Un morceau en cours ? <span className="optional">Facultatif</span></label>
        <textarea id={`project-${variant}`} name="project" maxLength={500} rows={3} placeholder="Où en êtes-vous, et qu’aimeriez-vous simplifier ?" />
      </div>
      <div className="trap" aria-hidden="true">
        <label htmlFor={`website-${variant}`}>Site web</label>
        <input id={`website-${variant}`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="check-row">
        <input id={`consent-${variant}`} type="checkbox" name="consent" required />
        <span className="check-copy"><label htmlFor={`consent-${variant}`}>J’accepte que Frandeley utilise ces informations pour gérer ma demande de participation conformément à sa politique de confidentialité.</label> <Link href="/confidentialite">Lire la politique de confidentialité</Link>. <b aria-hidden="true">*</b></span>
      </div>
      {newsletterEnabled ? (
        <label className="check-row">
          <input type="checkbox" name="updates" />
          <span>Je souhaite recevoir les nouvelles de Frandeley par e-mail. Cette option est facultative et distincte de ma demande au pilote.</span>
        </label>
      ) : (
        <p className="newsletter-note">L’inscription aux nouvelles par e-mail sera proposée dès que l’envoi sera activé. Votre demande au pilote reste disponible.</p>
      )}
      {state === "error" && <p className="form-error" role="alert">{message}</p>}
      <button className="button form-submit" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Enregistrement…" : "Rejoindre la liste du pilote"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-note">Inscription gratuite, sans garantie de sélection. Aucun paiement demandé.</p>
    </form>
  );
}

function newsletterStatusMessage(status?: unknown) {
  if (status === "pending") return "Un e-mail de confirmation Mailchimp va vous être envoyé. Confirmez votre adresse pour recevoir les nouvelles du projet.";
  if (status === "subscribed") return "Votre demande est enregistrée et votre adresse reçoit déjà les nouvelles de Frandeley.";
  if (status === "error") return "Votre demande au pilote est enregistrée, mais l’inscription aux nouvelles n’a pas abouti. Vous pourrez réessayer plus tard.";
  if (status === "not_configured") return "Votre demande au pilote est enregistrée. L’inscription aux nouvelles par e-mail n’est pas encore activée.";
  return "";
}
