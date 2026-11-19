import Image from "next/image";
import Link from "next/link";
import type { Data } from "@/app/contexts/data";
import { formatPrice, type Faq, type ServicePageData } from "@/lib/services";

type Props = {
  page: ServicePageData;
  related: ServicePageData[];
  profile: Data["profile"];
};

const HOURS = "Lun–Ven 10h–19h · Sam 10h–18h · Dim fermé";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export default function ServicePage({ page, related, profile }: Props) {
  const telHref = `tel:${profile.telephone.replace(/[^\d+]/g, "")}`;
  const faq: Faq[] = [
    ...page.faq,
    {
      question: "Comment prendre rendez-vous ?",
      answer: `Appelez l'institut au ${profile.telephone} ou envoyez un message via la page contact : Karine vous répond rapidement pour fixer un créneau.`,
    },
    {
      question: "Où se trouve l'institut ?",
      answer: `Karine Beauté Zen est situé au ${profile.adress}, ${profile.postalcode} ${profile.city}. Ouvert du lundi au vendredi de 10h à 19h et le samedi de 10h à 18h (fermé le dimanche).`,
    },
    {
      question: "Puis-je offrir cette prestation ?",
      answer:
        "Oui. Les massages, la manucure complète et les cartes cadeaux à montant libre sont disponibles dans la boutique en ligne, avec paiement sécurisé et envoi par e-mail.",
      cta: { label: "Aller à la boutique", href: "/boutique" },
    },
  ];

  return (
    <main className="overflow-x-clip">
      <section className="relative">
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-72 h-80 w-80 rounded-full bg-blush-deep/60 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-12 px-5 pb-16 pt-28 md:px-8 md:pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pb-24">
          <div>
            <nav aria-label="Fil d'Ariane" className="animate-rise text-sm text-ink-soft">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="transition hover:text-accent-deep">
                    Accueil
                  </Link>
                </li>
                <li aria-hidden>·</li>
                <li aria-current="page" className="text-ink">
                  {page.navLabel}
                </li>
              </ol>
            </nav>

            <p
              className="animate-rise mt-8 text-sm tracking-[0.28em] text-accent uppercase"
              style={delay(80)}
            >
              {page.eyebrow}
            </p>
            <h1
              className="animate-rise mt-3 font-display text-5xl leading-[0.98] text-balance text-ink sm:text-6xl lg:text-7xl"
              style={delay(140)}
            >
              {page.h1.split("Saint-Pierre-des-Fleurs").map((part, i, parts) => (
                <span key={i}>
                  {part}
                  {i < parts.length - 1 && <span className="whitespace-nowrap">Saint-Pierre-des-Fleurs</span>}
                </span>
              ))}
            </h1>
            <p
              className="animate-rise mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg"
              style={delay(220)}
            >
              {page.intro}
            </p>

            <ul className="animate-rise mt-8 flex flex-wrap gap-2" style={delay(300)}>
              {page.highlights.map((item) => {
                const toShop = /carte cadeau|offrir/i.test(item);
                const chip = "flex items-center gap-2 border border-blush-deep bg-pearl/70 px-4 py-2 text-sm text-ink";
                return (
                  <li key={item}>
                    {toShop ? (
                      <Link href="/boutique" className={`${chip} transition hover:border-accent hover:bg-white`}>
                        <span aria-hidden className="text-accent">
                          ✦
                        </span>
                        {item}
                        <span aria-hidden className="text-accent-deep">
                          →
                        </span>
                      </Link>
                    ) : (
                      <span className={chip}>
                        <span aria-hidden className="text-accent">
                          ✦
                        </span>
                        {item}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="animate-rise mt-10 flex flex-wrap gap-3" style={delay(380)}>
              <Link
                href={telHref}
                className="bg-ink px-6 py-3 text-sm tracking-wide text-pearl transition hover:bg-accent-deep"
              >
                Appeler le {profile.telephone}
              </Link>
              <Link
                href="/contact"
                className="border border-ink/25 px-6 py-3 text-sm tracking-wide text-ink transition hover:border-ink"
              >
                Demander un rendez-vous
              </Link>
              <Link
                href="/boutique"
                className="px-3 py-3 text-sm tracking-wide text-accent-deep underline underline-offset-4 transition hover:text-ink"
              >
                Offrir une carte cadeau
              </Link>
            </div>
          </div>

          <div className="animate-rise relative mx-auto w-full max-w-md lg:max-w-none" style={delay(200)}>
            <div
              aria-hidden
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-[999px] border border-accent/50 md:translate-x-6 md:translate-y-6"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-blush-deep">
              <Image
                src={page.image}
                alt={page.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-2 bg-pearl px-6 py-5 shadow-xl shadow-ink/10 md:-left-8">
              <p className="text-xs tracking-[0.22em] text-ink-soft uppercase">À partir de</p>
              <p className="font-display text-5xl leading-none text-accent-deep lining-nums">{formatPrice(page.minPrice)}</p>
              <p className="mt-2 text-sm text-ink-soft">
                {page.count} prestation{page.count > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {page.sections.length > 1 && (
        <nav
          aria-label="Rubriques de tarifs"
          className="sticky top-0 z-[11] border-y border-blush-deep/60 bg-pearl/85 backdrop-blur-md"
        >
          <ul className="mx-auto flex w-full max-w-[1400px] gap-2 overflow-x-auto px-5 py-3 md:px-8">
            {page.sections.map((section) => (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  className="block border border-transparent px-4 py-2 text-sm tracking-wide text-ink-soft transition hover:border-blush-deep hover:bg-white hover:text-ink"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        {page.notice && (
          <aside role="note" className="mb-16 border border-amber-800/40 bg-amber-50 p-5 text-amber-950">
            <p className="text-sm leading-relaxed md:text-base">
              <strong>{page.notice.title} !</strong> {page.notice.text}
            </p>
          </aside>
        )}

        <div className="flex flex-col gap-20 md:gap-28">
          {page.sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="grid scroll-mt-24 gap-8 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16"
            >
              <header className="md:sticky md:top-28 md:self-start">
                <p aria-hidden className="font-display text-6xl leading-none text-accent/40 lining-nums md:text-7xl">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 id={`${section.id}-title`} className="mt-3 font-display text-4xl leading-tight text-ink">
                  {section.title}
                </h2>
                {section.intro && <p className="mt-3 text-ink-soft">{section.intro}</p>}
              </header>

              <ul className="border-t border-ink/15">
                {section.entries.map((entry) => (
                  <li
                    key={entry.key}
                    className="group grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-1 border-b border-blush-deep px-1 py-5 transition hover:bg-white/70 md:px-4"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-ink">{entry.title}</h3>
                      {entry.description && (
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">{entry.description}</p>
                      )}
                    </div>
                    <ul className="flex flex-col items-end gap-2">
                      {entry.options.map((option, i) => (
                        <li key={i} className="flex items-center gap-3">
                          {option.time && (
                            <span className="text-sm text-ink-soft">
                              <span className="sr-only">Durée : </span>
                              {option.time}
                            </span>
                          )}
                          <span className="font-display text-3xl leading-none text-accent-deep lining-nums">
                            <span className="sr-only">Prix : </span>
                            {formatPrice(option.price)}
                          </span>
                          {option.offer && (
                            <Link
                              href={option.offer.href}
                              title={
                                option.offer.kind === "product"
                                  ? "Offrir ce soin en ligne"
                                  : `Offrir une carte cadeau de ${formatPrice(option.price)}`
                              }
                              aria-label={`Offrir : ${entry.title}${option.time ? `, ${option.time}` : ""}, ${formatPrice(option.price)}`}
                              className="shrink-0 border border-accent/50 px-3 py-1.5 text-xs tracking-wide text-accent-deep transition hover:border-accent-deep hover:bg-accent-deep hover:text-pearl"
                            >
                              Offrir
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-16 text-sm text-ink-soft">
          Tarifs indicatifs en euros TTC, susceptibles d&apos;évoluer. Réservation sur rendez-vous.
          {page.offerable && (
            <>
              {" "}
              Un soin vous fait envie pour quelqu&apos;un d&apos;autre ? Le bouton « Offrir » ouvre la commande en ligne
              (le soin lui-même s&apos;il est en boutique, sinon une carte cadeau du même montant).
            </>
          )}
        </p>
      </div>

      <section className="bg-pearl/70 py-16 md:py-24" aria-labelledby="faq-title">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-16">
          <div>
            <p className="mb-2 text-sm tracking-[0.22em] text-accent uppercase">Bon à savoir</p>
            <h2 id="faq-title" className="font-display text-4xl text-ink md:text-5xl">
              Questions fréquentes
            </h2>
          </div>
          <div className="border-t border-ink/15">
            {faq.map((item) => (
              <details key={item.question} className="group border-b border-blush-deep py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg text-ink [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span aria-hidden className="text-2xl text-accent transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{item.answer}</p>
                {item.cta && (
                  <Link
                    href={item.cta.href}
                    className="mt-3 inline-block text-sm tracking-wide text-accent-deep underline underline-offset-4 transition hover:text-ink"
                  >
                    {item.cta.label} →
                  </Link>
                )}
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8 md:py-24" aria-labelledby="related-title">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm tracking-[0.22em] text-accent uppercase">Poursuivre</p>
            <h2 id="related-title" className="font-display text-4xl text-ink md:text-5xl">
              Découvrir aussi
            </h2>
          </div>
          <Link href="/#soins" className="text-sm tracking-wide text-ink underline underline-offset-4">
            Toutes nos prestations
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {related.map((item) => (
            <li key={item.slug}>
              <Link href={`/${item.slug}`} className="group relative block aspect-[4/5] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <p className="font-display text-xl text-pearl md:text-2xl">{item.cardLabel}</p>
                  <span className="mt-1 inline-block text-sm text-pearl/80 transition group-hover:text-pearl">
                    Dès {formatPrice(item.minPrice)} →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-5 pb-16 md:px-8 md:pb-24">
        <div className="relative overflow-hidden bg-ink px-8 py-14 text-pearl md:px-14 md:py-16">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-xl">
              <p className="mb-2 text-sm tracking-[0.22em] text-blush uppercase">Rendez-vous</p>
              <h2 className="font-display text-4xl md:text-5xl">Prenez un moment pour vous</h2>
              <p className="mt-4 text-pearl/80">
                {profile.adress}, {profile.postalcode} {profile.city}
                <br />
                {HOURS}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={telHref}
                className="bg-pearl px-6 py-3 text-sm tracking-wide text-ink transition hover:bg-blush"
              >
                {profile.telephone}
              </Link>
              <Link
                href="/contact"
                className="border border-pearl/70 px-6 py-3 text-sm tracking-wide text-pearl transition hover:bg-pearl/10"
              >
                Écrire à Karine
              </Link>
              <Link
                href="/boutique"
                className="border border-pearl/70 px-6 py-3 text-sm tracking-wide text-pearl transition hover:bg-pearl/10"
              >
                Offrir un soin
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

