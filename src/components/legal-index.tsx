import Link from "next/link";

type LegalIndexProps = {
  label: string;
  items: readonly { id: string; title: string }[];
};

export function LegalIndex({ label, items }: LegalIndexProps) {
  return (
    <aside className="legal-aside">
      <span className="eyebrow">Sur cette page</span>
      <nav aria-label={label}>
        {items.map((item, index) => (
          <a href={`#${item.id}`} key={item.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.title}</strong>
            <span aria-hidden="true">↘</span>
          </a>
        ))}
      </nav>
      <div className="legal-aside-cta">
        <p>Une question sur ces informations ? Écrivez à l’équipe Frandeley.</p>
        <Link href="/contact">Contacter Frandeley <span aria-hidden="true">↗</span></Link>
      </div>
    </aside>
  );
}
