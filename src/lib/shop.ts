import data from "../../public/data.json";
import { GIFT_CARD_MAX, GIFT_CARD_MIN, GIFT_CARD_TITLE } from "./gift";
import { alignShopPrices } from "./pricing";

export type ShopItem = { id: number; title: string; price: number };

// Prix de la boutique alignés sur le catalogue (voir pricing.ts) : c'est ce que le serveur facture.
export const SHOP: ShopItem[] = alignShopPrices(data as unknown as { prestations: unknown[]; shop: ShopItem[] }).shop;

/** Prix autorisé côté serveur pour un produit de la boutique, ou null si la demande est invalide. */
export function resolvePrice(title: unknown, requested: unknown): { title: string; price: number } | null {
  if (typeof title !== "string") return null;
  const item = SHOP.find((s) => s.title === title);
  if (!item) return null;

  if (item.title === GIFT_CARD_TITLE) {
    const price = Number(requested);
    if (!Number.isFinite(price) || price < GIFT_CARD_MIN || price > GIFT_CARD_MAX) return null;
    return { title: item.title, price: Math.round(price * 100) / 100 };
  }
  return { title: item.title, price: item.price };
}
