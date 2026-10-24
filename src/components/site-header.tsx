import Link from "next/link";
import { Brand } from "./brand";
import { navigation } from "@/lib/content";
import { isPilotSignupOpen } from "@/lib/pilot-signup";

export function SiteHeader() {
  const ctaLabel = isPilotSignupOpen() ? "Rejoindre le pilote" : "Suivre le pré-lancement";
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Brand />
        <nav className="desktop-nav" aria-label="Navigation principale">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <Link href="/pilote#inscription" className="button button-small header-cta">
          {ctaLabel} <span aria-hidden="true">↗</span>
        </Link>
        <details className="mobile-menu">
          <summary className="mobile-toggle">Menu</summary>
          <nav className="mobile-nav" aria-label="Navigation mobile">
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <Link href="/pilote#inscription" className="button">{ctaLabel} <span aria-hidden="true">↗</span></Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
