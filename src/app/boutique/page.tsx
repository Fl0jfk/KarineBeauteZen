"use client";

import ListCards from "../components/List/List";
import { useData } from "../contexts/data";

export default function Boutique() {
  const { shop } = useData();

  return (
    <main className="pt-24 md:pt-28">
      <section className="mx-auto w-full max-w-[1400px] px-5 pb-8 md:px-8">
        <p className="mb-2 text-sm tracking-[0.22em] text-accent uppercase">Boutique</p>
        <h1 className="font-display text-5xl text-ink md:text-6xl">Offrir un soin</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Choisissez une prestation ou une carte cadeau au montant libre, puis finalisez en quelques
          clics.
        </p>
      </section>
      <ListCards shop={shop} />
    </main>
  );
}
