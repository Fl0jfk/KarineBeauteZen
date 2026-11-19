"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import FormBuy from "../Forms/FormBuy";
import { GIFT_CARD_MAX, GIFT_CARD_MIN, GIFT_CARD_TITLE, type OfferRequest } from "@/lib/gift";

interface CardProps {
  item: {
    image: string;
    title: string;
    price: number;
    description: string;
  };
  /** Présent quand on arrive depuis un bouton « Offrir » d'une page de soins. */
  offer?: OfferRequest;
}

export default function Card({ item, offer }: CardProps) {
  const [manualOpen, setManualOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [typedPrice, setTypedPrice] = useState<number | null>(null);
  const isGiftCard = item.title === GIFT_CARD_TITLE;
  const offeredAmount =
    isGiftCard && offer?.amount && offer.amount >= GIFT_CARD_MIN && offer.amount <= GIFT_CARD_MAX
      ? Math.round(offer.amount * 100) / 100
      : undefined;
  const customPrice = typedPrice ?? offeredAmount ?? item.price;
  const isButtonDisabled = customPrice < GIFT_CARD_MIN || customPrice > GIFT_CARD_MAX;
  const open = manualOpen || (!!offer && !dismissed);

  const openCheckout = () => setManualOpen(true);
  const hasOffer = !!offer;
  const closeCheckout = useCallback(() => {
    setManualOpen(false);
    setDismissed(true);
    if (hasOffer) window.history.replaceState(null, "", "/boutique");
  }, [hasOffer]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCheckout();
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeCheckout]);

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden bg-surface">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <p className="absolute top-4 right-4 bg-pearl/95 px-3 py-1.5 text-sm text-ink">
            {isGiftCard ? `À partir de ${item.price}€` : `${item.price}€`}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <h2 className="font-display text-2xl text-ink">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>
          </div>

          {isGiftCard && (
            <label className="flex flex-col gap-2 text-sm text-ink-soft">
              Montant de la carte
              <input
                type="number"
                min={GIFT_CARD_MIN}
                max={GIFT_CARD_MAX}
                value={customPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= GIFT_CARD_MAX) setTypedPrice(value);
                }}
                className="border border-blush-deep bg-pearl px-3 py-2 text-ink outline-none focus:border-accent"
              />
            </label>
          )}

          <button
            type="button"
            onClick={openCheckout}
            disabled={isButtonDisabled}
            className={`mt-auto bg-ink px-5 py-3 text-sm tracking-wide text-pearl transition hover:bg-accent-deep ${
              isButtonDisabled ? "cursor-not-allowed opacity-40" : ""
            }`}
          >
            Offrir
          </button>
        </div>
      </article>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[40] flex items-end justify-center bg-ink/45 p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCheckout}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-title"
              className="max-h-[92vh] w-full max-w-lg overflow-y-auto bg-pearl p-6 shadow-xl sm:p-8"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm tracking-[0.18em] text-accent uppercase">Commande</p>
                  <h3 id="checkout-title" className="font-display text-3xl text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-ink-soft">{customPrice}€</p>
                  {offer?.label && isGiftCard && (
                    <p className="mt-1 text-sm text-ink-soft">Pour offrir : {offer.label}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="text-sm text-ink-soft hover:text-ink"
                  aria-label="Fermer"
                >
                  Fermer
                </button>
              </div>
              <FormBuy title={item.title} image={item.image} amount={customPrice} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
