"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export type ServiceCard = {
  slug: string;
  label: string;
  image: string;
  imageAlt: string;
  minPrice: number;
};

export default function ServicesGrid({ services }: { services: ServiceCard[] }) {
  if (!services.length) return null;

  return (
    <section id="soins" className="mx-auto w-full max-w-[1400px] scroll-mt-16 px-5 py-20 md:px-8 md:py-28">
      <div className="mb-12 max-w-xl">
        <p className="mb-2 text-sm tracking-[0.22em] text-accent uppercase">Prestations</p>
        <h2 className="font-display text-4xl text-ink md:text-5xl">Nos soins</h2>
        <p className="mt-3 text-ink-soft">
          Massages, soins du visage et du corps, onglerie, épilation… Ouvrez une rubrique pour consulter tous les
          tarifs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <motion.div
            key={service.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
          >
            <Link
              href={`/${service.slug}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden text-left"
            >
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-2xl text-pearl md:text-3xl">{service.label}</h3>
                <span className="mt-2 inline-block text-sm text-pearl/80 transition group-hover:text-pearl">
                  Dès {service.minPrice} € · Voir les tarifs →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
