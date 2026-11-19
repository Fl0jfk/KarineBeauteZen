export const GIFT_CARD_TITLE = "Carte cadeau";
export const GIFT_CARD_MIN = 10;
export const GIFT_CARD_MAX = 200;

export type Offer = {
  href: string;
  kind: "product" | "gift";
};

export type OfferRequest = { id: number; amount?: number; label?: string };

/** Lit ?offrir=<id>&montant=<n>&pour=<libellé> (liens « Offrir » des pages de soins). */
export function parseOffer(search: string): OfferRequest | null {
  const params = new URLSearchParams(search);
  if (!params.has("offrir")) return null;
  const id = Number(params.get("offrir"));
  if (!Number.isInteger(id)) return null;
  const amount = Number(params.get("montant"));
  return {
    id,
    amount: Number.isFinite(amount) && amount > 0 ? amount : undefined,
    label: params.get("pour")?.slice(0, 80) || undefined,
  };
}

type ShopLike = { id: number; title: string; price: number };

export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Lien « Offrir » pour une prestation :
 * - même nom et même prix qu'un produit de la boutique → ce produit ;
 * - sinon → carte cadeau du montant de la prestation (si dans les limites de la boutique).
 */
export function offerFor(
  item: { title: string; price: number; time?: string },
  shop: ShopLike[]
): Offer | undefined {
  const name = normalize(item.title);
  const product = shop.find(
    (s) => s.title !== GIFT_CARD_TITLE && s.price === item.price && name.startsWith(normalize(s.title))
  );
  if (product) return { href: `/boutique?offrir=${product.id}`, kind: "product" };

  const card = shop.find((s) => s.title === GIFT_CARD_TITLE);
  if (!card || item.price < GIFT_CARD_MIN || item.price > GIFT_CARD_MAX) return undefined;
  const label = (item.time ? `${item.title} (${item.time})` : item.title).slice(0, 80);
  return {
    href: `/boutique?offrir=${card.id}&montant=${item.price}&pour=${encodeURIComponent(label)}`,
    kind: "gift",
  };
}
