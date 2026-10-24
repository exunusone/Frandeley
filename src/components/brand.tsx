import Image from "next/image";
import Link from "next/link";

type BrandTone = "on-dark" | "on-light";

export function Brand({ tone = "on-dark" }: { tone?: BrandTone }) {
  const source = tone === "on-dark"
    ? "/images/frandeley-monogram-light.png"
    : "/images/frandeley-monogram.png";

  return (
    <Link href="/" className={`brand brand-${tone}`} aria-label="Accueil Frandeley">
      <span className="brand-mark">
        <Image src={source} alt="" fill sizes="(max-width: 600px) 46px, 54px" />
      </span>
    </Link>
  );
}
