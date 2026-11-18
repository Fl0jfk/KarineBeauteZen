import data from "../../public/data.json";

export type ShopItem = { id: number; title: string; price: number };

export const SHOP: ShopItem[] = data.shop;

export const GIFT_CARD_TITLE = "Carte cadeau";
export const GIFT_CARD_MIN = 10;
export const GIFT_CARD_MAX = 200;

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
