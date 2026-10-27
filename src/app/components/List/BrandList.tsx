"use client";

import { useData } from "@/app/contexts/data";
import Image from "next/image";

export default function BrandList() {
  const { brands } = useData();
  if (!brands.length) return null;

  const loop = [...brands, ...brands];

  return (
    <section className="w-full overflow-hidden py-16 md:py-24">
      <div className="mx-auto mb-10 max-w-[1400px] px-5 md:px-8">
        <p className="mb-2 text-sm tracking-[0.22em] text-accent uppercase">Partenaires</p>
        <h2 className="font-display text-4xl text-ink md:text-5xl">Nos marques</h2>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-16 bg-gradient-to-r from-pearl to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 bg-gradient-to-l from-blush to-transparent md:w-28" />
        <div className="flex w-max animate-marquee gap-12 px-8">
          {loop.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex h-24 w-48 shrink-0 items-center justify-center opacity-80 transition hover:opacity-100 md:h-28 md:w-56"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={220}
                height={110}
                className="max-h-20 w-auto object-contain md:max-h-24"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
