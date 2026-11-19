import { GIFT_CARD_TITLE, normalize } from "./gift";

type CatalogItem = { title: string; price: number; time?: string };

type PricedData = {
  prestations: unknown[];
  shop: Array<{ title: string; price: number }>;
};

const isPriced = (value: unknown): value is CatalogItem =>
  !!value && typeof value === "object" && typeof (value as CatalogItem).price === "number";

/** Toutes les prestations du catalogue, quelle que soit la rubrique (y compris les sous-groupes de la manucure). */
export function flattenCatalog(prestations: unknown[]): CatalogItem[] {
  const items: CatalogItem[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) value.forEach(visit);
    else if (isPriced(value)) items.push(value);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  visit(prestations);
  return items;
}

/**
 * Le catalogue est la source de vérité des prix : chaque produit de la boutique qui correspond
 * à une prestation (même nom, et même durée si elle est indiquée dans sa description) reprend
 * son prix. La carte cadeau et les produits sans équivalent gardent leur prix propre.
 */
export function alignShopPrices<T extends PricedData>(data: T): T {
  const catalog = flattenCatalog(data.prestations);

  const shop = data.shop.map((product) => {
    if (product.title === GIFT_CARD_TITLE) return product;

    const name = normalize(product.title);
    const candidates = catalog.filter((item) => normalize(item.title).startsWith(name));
    if (!candidates.length) return product;

    const description = normalize((product as { description?: string }).description ?? "");
    const sameDuration = candidates
      .filter((item) => item.time && description.includes(normalize(item.time)))
      .sort((a, b) => (b.time?.length ?? 0) - (a.time?.length ?? 0));

    return { ...product, price: (sameDuration[0] ?? candidates[0]).price };
  });

  return { ...data, shop };
}
