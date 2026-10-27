"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useData } from "@/app/contexts/data";
import { useDispatch } from "react-redux";
import { setModalOpenSoins } from "@/app/redux/reducers/modal";

export default function Hero() {
  const { categories } = useData();
  const dispatch = useDispatch();
  const cover = categories[0]?.img;

  return (
    <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden">
      {cover && (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <Image
            src={cover}
            alt="Soins visage et corps chez Karine Beauté Zen"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-ink/10" />

      <div className="relative z-[1] mx-auto w-full max-w-[1400px] px-5 pb-16 pt-32 md:px-8 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-2xl text-pearl"
        >
          <p className="mb-3 text-sm tracking-[0.28em] uppercase text-pearl/80">
            Institut de beauté
          </p>
          <h1 className="font-display text-5xl leading-[0.95] tracking-wide sm:text-6xl md:text-7xl">
            Karine Beauté Zen
          </h1>
          <p className="mt-5 max-w-md text-base text-pearl/90 md:text-lg">
            Soins, massages et moments de détente à Saint-Pierre-des-Fleurs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                dispatch(setModalOpenSoins());
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-pearl px-6 py-3 text-sm tracking-wide text-ink transition hover:bg-blush"
            >
              Découvrir les soins
            </button>
            <Link
              href="/boutique"
              className="border border-pearl/70 px-6 py-3 text-sm tracking-wide text-pearl transition hover:bg-pearl/10"
            >
              Offrir une carte cadeau
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
