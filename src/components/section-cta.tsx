import Link from "next/link";

export function SectionCta({ label = "Rejoindre le pilote", href = "/pilote#inscription" }: { label?: string; href?: string }) {
  return <Link className="button" href={href}>{label}<span aria-hidden="true">↗</span></Link>;
}
