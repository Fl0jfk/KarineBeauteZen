import { SITE_URL, getSiteData, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Boutique : massages et cartes cadeaux",
  description:
    "Offrez un massage, une manucure ou une carte cadeau au montant libre chez Karine Beauté Zen, institut de beauté à Saint-Pierre-des-Fleurs. Paiement en ligne sécurisé.",
  path: "/boutique",
});

export default async function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  const { shop } = await getSiteData();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Boutique Karine Beauté Zen",
    itemListElement: shop.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.title,
        description: item.description,
        image: item.image,
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/boutique`,
          priceCurrency: "EUR",
          price: item.price,
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
