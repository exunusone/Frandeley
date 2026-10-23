import Image from "next/image";

export function InnerHero({
  number,
  title,
  description,
  image,
  alt,
}: {
  number: string;
  title: React.ReactNode;
  description: string;
  image: string;
  alt: string;
}) {
  return (
    <section className="inner-hero">
      <Image src={image} alt={alt} fill priority sizes="100vw" />
      <div className="inner-shade" />
      <div className="shell inner-hero-content">
        <span className="eyebrow">{number} / FRANDELEY</span>
        <span className="inner-hero-status"><span aria-hidden="true" /> Concept en validation</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
