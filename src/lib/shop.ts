import data from "../../public/data.json";
import { GIFT_CARD_MAX, GIFT_CARD_MIN, GIFT_CARD_TITLE, formatDuration, giftLabel } from "./gift";
import { alignShopPrices, flattenCatalog } from "./pricing";

export type ShopItem = { id: number; title: string; price: number };

// Prix de la boutique alignés sur le catalogue (voir pricing.ts) : c'est ce que le serveur facture.
export const SHOP: ShopItem[] = alignShopPrices(data as unknown as { prestations: unknown[]; shop: ShopItem[] }).shop;

/**
 * Mention « idéal pour… » d'une carte cadeau : acceptée seulement si elle correspond à une vraie
 * prestation du catalogue dont le prix est égal au montant payé (le libellé vient du navigateur).
 */
export function resolveGiftLabel(label: unknown, price: number): string | undefined {
  if (typeof label !== "string") return undefined;
  const wanted = label.slice(0, 80);
  const match = flattenCatalog(data.prestations as unknown[]).find(
    (item) => item.price === price && giftLabel(item.title, formatDuration(item.time)) === wanted
  );
  return match ? wanted : undefined;
}

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
