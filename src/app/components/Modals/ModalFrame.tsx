"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setModalClose } from "@/app/redux/reducers/modal";
import { useData } from "@/app/contexts/data";

type ModalFrameProps = {
  visible: boolean;
  title: string;
  children: ReactNode;
};

export default function ModalFrame({ visible, title, children }: ModalFrameProps) {
  const [hiddenClass, setHiddenClass] = useState(visible ? "" : "hidden");
  const dispatch = useDispatch();
  const { profile } = useData();
  const ref = useRef<HTMLDivElement>(null);
  const closeModal = () => dispatch(setModalClose());

  useEffect(() => {
    if (visible) {
      setHiddenClass("");
      ref.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const timer = setTimeout(() => setHiddenClass("hidden"), 400);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <motion.section
      ref={ref}
      className={`relative flex h-full w-full flex-col gap-6 ${hiddenClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm tracking-[0.18em] text-accent uppercase">Tarifs</p>
          <h3 className="font-display text-3xl text-ink md:text-4xl">{title}</h3>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center bg-ink text-pearl transition hover:bg-accent-deep"
          onClick={closeModal}
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      {children}

      <p className="pb-8 text-sm leading-relaxed text-ink-soft">
        Pour réserver, appelez le{" "}
        <Link href={`tel:${profile.telephone}`} className="text-ink underline">
          {profile.telephone}
        </Link>
        , utilisez le{" "}
        <Link className="text-ink underline" onClick={closeModal} href="/contact">
          formulaire
        </Link>
        , ou offrez un soin via la{" "}
        <Link onClick={closeModal} className="text-ink underline" href="/boutique">
          boutique
        </Link>
        .
      </p>
    </motion.section>
  );
}
