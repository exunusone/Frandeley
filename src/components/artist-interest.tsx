"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type TurnstileWidgetId = string;
type TurnstileOptions = {
  sitekey: string;
  action: string;
  size: "invisible";
  execution: "execute";
  callback: (token: string) => void;
  "error-callback": () => void;
  "expired-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => TurnstileWidgetId;
  execute: (widgetId: TurnstileWidgetId) => void;
  reset: (widgetId: TurnstileWidgetId) => void;
  remove: (widgetId: TurnstileWidgetId) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type InterestState = "idle" | "challenge" | "saving" | "error";

const visitorStorageKey = "frandeley:interest-visitor:v1";
const interestStorageKey = "frandeley:interest-choice:v1";
const maxVisitorAge = 365 * 24 * 60 * 60 * 1000;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  return new Promise<TurnstileApi>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>("script[data-frandeley-turnstile]");
    if (!script) {
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.frandeleyTurnstile = "true";
      document.head.appendChild(script);
    }

    const timeout = window.setTimeout(() => reject(new Error("Turnstile timeout")), 15_000);
    script.addEventListener("load", () => {
      window.clearTimeout(timeout);
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Turnstile unavailable"));
    }, { once: true });
    script.addEventListener("error", () => {
      window.clearTimeout(timeout);
      reject(new Error("Turnstile failed to load"));
    }, { once: true });
  });
}

function readActiveVisitorId() {
  try {
    const stored = localStorage.getItem(visitorStorageKey);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (parsed && typeof parsed === "object" && "id" in parsed && "createdAt" in parsed) {
        const value = parsed as { id?: unknown; createdAt?: unknown };
        if (typeof value.id === "string" && typeof value.createdAt === "number" &&
            value.createdAt <= Date.now() && Date.now() - value.createdAt < maxVisitorAge) {
          return value.id;
        }
      }
      localStorage.removeItem(visitorStorageKey);
      localStorage.removeItem(interestStorageKey);
    }
  } catch {
    // Keep the button usable when browser storage is disabled; this visit will be temporary.
  }
  return null;
}

function getVisitorId(visitorId: { current: string | null }) {
  if (visitorId.current) return visitorId.current;
  const stored = readActiveVisitorId();
  if (stored) {
    visitorId.current = stored;
    return stored;
  }

  const id = crypto.randomUUID();
  visitorId.current = id;
  try {
    localStorage.setItem(visitorStorageKey, JSON.stringify({ id, createdAt: Date.now() }));
  } catch {
    // The current request still works, but its identifier cannot persist in this browser.
  }
  return id;
}

export function ArtistInterest({ enabled = false, variant = "panel" }: {
  enabled?: boolean;
  variant?: "panel" | "standalone";
}) {
  const widgetContainer = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<TurnstileWidgetId | null>(null);
  const visitorId = useRef<string | null>(null);
  const hasInterestRef = useRef(false);
  const inFlight = useRef(false);
  const [count, setCount] = useState<number | null>(null);
  const [hasInterest, setHasInterest] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [state, setState] = useState<InterestState>("idle");
  const [message, setMessage] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const configured = enabled && Boolean(siteKey);

  const submitChoice = useCallback(async (token: string) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setState("saving");
    setMessage("");

    try {
      const response = await fetch("/api/interet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: getVisitorId(visitorId), token, interested: !hasInterestRef.current }),
      });
      const result = await response.json() as {
        error?: string;
        interested?: boolean;
        count?: number;
        changed?: boolean;
      };
      if (!response.ok || typeof result.interested !== "boolean" || typeof result.count !== "number") {
        throw new Error(result.error || "Votre choix n’a pas pu être enregistré.");
      }

      hasInterestRef.current = result.interested;
      setHasInterest(result.interested);
      setCount(result.count);
      setState("idle");
      setMessage(result.interested
        ? result.changed ? "Merci, votre intérêt est enregistré." : "Votre intérêt avait déjà été enregistré sur ce navigateur."
        : result.changed ? "Votre intérêt a été retiré." : "Aucun intérêt n’était enregistré sur ce navigateur.");
      try {
        if (result.interested) localStorage.setItem(interestStorageKey, "1");
        else localStorage.removeItem(interestStorageKey);
      } catch {
        // The server remains authoritative if browser storage is unavailable.
      }
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Une erreur est survenue. Réessayez.");
    } finally {
      inFlight.current = false;
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const activeVisitorId = readActiveVisitorId();
    visitorId.current = activeVisitorId;
    let savedInterest = false;
    try {
      savedInterest = Boolean(activeVisitorId && localStorage.getItem(interestStorageKey) === "1");
    } catch {
      savedInterest = false;
    }
    hasInterestRef.current = savedInterest;
    setHasInterest(savedInterest);

    void fetch("/api/interet", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Count unavailable");
        const result = await response.json() as { count?: unknown };
        if (typeof result.count === "number" && Number.isFinite(result.count) && active) setCount(result.count);
      })
      .catch(() => {
        if (active) setCount(null);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!configured || !siteKey || !widgetContainer.current) return;
    let active = true;

    void loadTurnstile().then((turnstile) => {
      if (!active || !widgetContainer.current) return;
      widgetId.current = turnstile.render(widgetContainer.current, {
        sitekey: siteKey,
        action: "artist_interest",
        size: "invisible",
        execution: "execute",
        callback: (token) => { void submitChoice(token); },
        "error-callback": () => {
          if (active) {
            setState("error");
            setMessage("La vérification anti-robot n’a pas abouti. Réessayez.");
          }
        },
        "expired-callback": () => {
          if (active) {
            setState("error");
            setMessage("La vérification a expiré. Réessayez.");
          }
        },
      });
      setWidgetReady(true);
    }).catch(() => {
      if (active) {
        setMessage("La vérification anti-robot est indisponible pour le moment.");
        setState("error");
      }
    });

    return () => {
      active = false;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [configured, siteKey, submitChoice]);

  function requestChoice() {
    if (!configured) {
      setMessage("Le compteur sera disponible dès que sa vérification anti-robot sera configurée.");
      setState("error");
      return;
    }
    if (!widgetReady || !widgetId.current || !window.turnstile) {
      setMessage("La vérification anti-robot charge encore. Réessayez dans un instant.");
      setState("error");
      return;
    }

    setMessage("");
    setState("challenge");
    try {
      window.turnstile.execute(widgetId.current);
    } catch {
      setState("error");
      setMessage("La vérification anti-robot n’a pas pu démarrer. Réessayez.");
    }
  }

  return (
    <div className={`artist-interest artist-interest-${variant}`}>
      <button className="button interest-button" type="button" onClick={requestChoice}
        disabled={!configured || !widgetReady || state === "challenge" || state === "saving"}>
        {state === "challenge" ? "Vérification…" : state === "saving" ? "Enregistrement…" : hasInterest ? "Annuler mon intérêt" : "Je suis intéressé·e"}
        <span aria-hidden="true">{hasInterest ? "↶" : "↗"}</span>
      </button>
      <div className="turnstile-widget" ref={widgetContainer} aria-hidden="true" />
      <p className="interest-count" aria-live="polite">
        {count === null ? configured ? "Le compteur se chargera dès que le service sera disponible." : "Le compteur d’intérêt arrive bientôt." :
          <><strong>{count.toLocaleString("fr-FR")}</strong> {count === 1 ? "marque d’intérêt enregistrée" : "marques d’intérêt enregistrées"}</>}
      </p>
      {!configured
        ? <p className="interest-feedback" role="status">Le bouton s’activera dès que la vérification anti-robot sera configurée.</p>
        : message && <p className={`interest-feedback ${state === "error" ? "is-error" : ""}`} role="status">{message}</p>}
      <p className="interest-note">Aucun e-mail n’est demandé. Un identifiant aléatoire reste dans ce navigateur pour éviter les doublons, puis expire au bout d’un an. <Link href="/confidentialite">Détails sur les données</Link>.</p>
    </div>
  );
}
