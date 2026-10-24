import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Accueil Frandeley">
      <span className="brand-mark">
        <Image src="/images/frandeley-monogram.png" alt="" fill sizes="(max-width: 600px) 46px, 54px" />
      </span>
    </Link>
  );
}
