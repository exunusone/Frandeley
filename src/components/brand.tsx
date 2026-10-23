import Image from "next/image";
import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Frandeley — accueil">
      <span className="brand-mark">
        <Image src="/images/mark-source.webp" alt="" width={52} height={52} sizes="52px" />
      </span>
      <span className="brand-name">
        FRANDELEY
        {!compact && <small>MUSIC MEETS TOMORROW</small>}
      </span>
    </Link>
  );
}
