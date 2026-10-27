import Hero from "./components/Hero/Hero";
import ServicesGrid from "./components/Services/ServicesGrid";
import Modal from "./components/Modals/Modal";
import Testimonials from "./components/Testimonials/Testimonials";
import BrandList from "./components/List/BrandList";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesGrid />

      <section className="mx-auto w-full max-w-[1400px] px-5 py-10 md:px-8 md:py-16">
        <div className="relative overflow-hidden bg-ink px-8 py-14 text-pearl md:px-14 md:py-16">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative max-w-xl">
            <p className="mb-2 text-sm tracking-[0.22em] text-blush uppercase">Cadeaux</p>
            <h2 className="font-display text-4xl md:text-5xl">Offrez un moment pour soi</h2>
            <p className="mt-4 text-pearl/80">
              Massages et cartes cadeaux à personnaliser, disponibles en ligne.
            </p>
            <Link
              href="/boutique"
              className="mt-8 inline-block bg-pearl px-6 py-3 text-sm tracking-wide text-ink transition hover:bg-blush"
            >
              Voir la boutique
            </Link>
          </div>
        </div>
      </section>

      <BrandList />
      <Testimonials />
      <Modal />
    </main>
  );
}
