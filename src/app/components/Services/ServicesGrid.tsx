"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useData } from "@/app/contexts/data";
import {
  setModalOpenCils,
  setModalOpenEpilation,
  setModalOpenManucure,
  setModalOpenMaquillage,
  setModalOpenSoins,
  setModalOpenSolarium,
} from "@/app/redux/reducers/modal";

export default function ServicesGrid() {
  const { categories } = useData();
  const dispatch = useDispatch();

  const openService = (name: string) => {
    switch (name) {
      case "Les soins visages et corps":
        dispatch(setModalOpenSoins());
        break;
      case "Manucure":
        dispatch(setModalOpenManucure());
        break;
      case "Épilation":
        dispatch(setModalOpenEpilation());
        break;
      case "Cils et sourcils":
        dispatch(setModalOpenCils());
        break;
      case "Maquillage":
        dispatch(setModalOpenMaquillage());
        break;
      case "Solarium":
        dispatch(setModalOpenSolarium());
        break;
      default:
        break;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!categories.length) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
      <div className="mb-12 max-w-xl">
        <p className="mb-2 text-sm tracking-[0.22em] text-accent uppercase">Prestations</p>
        <h2 className="font-display text-4xl text-ink md:text-5xl">Nos soins</h2>
        <p className="mt-3 text-ink-soft">
          Choisissez une catégorie pour consulter les tarifs et réserver.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            type="button"
            onClick={() => openService(category.name)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="group relative aspect-[4/5] w-full overflow-hidden text-left"
          >
            <Image
              src={category.img}
              alt={category.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-display text-2xl text-pearl md:text-3xl">{category.name}</h3>
              <span className="mt-2 inline-block text-sm text-pearl/80 transition group-hover:text-pearl">
                Voir les tarifs →
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
