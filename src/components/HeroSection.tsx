import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="tw-hero">
      <Image src="/images/trendware-hero-premium.png" alt="Ausgewählte Trendware Alltagshelfer" fill priority sizes="100vw" className="tw-hero-image" />
      <div className="tw-hero-shade" />
      <div className="tw-shell tw-hero-content">
        <div className="max-w-[650px]">
          <p className="tw-eyebrow">Clever. Schön. Anders.</p>
          <h1>Dinge, von denen<br />du nicht wusstest,<br />dass du sie brauchst.</h1>
          <p className="tw-hero-copy">Handverlesene Alltagshelfer, die Funktion und Design mühelos verbinden.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="tw-button tw-button-dark">Jetzt entdecken</Link>
            <Link href="#warum" className="tw-button tw-button-light">Über uns</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
