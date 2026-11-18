import { notFound } from "next/navigation";
import ServicePage from "../components/ServicePage/ServicePage";
import { SERVICE_SLUGS, getServicePage } from "@/lib/services";
import { SITE_NAME, SITE_URL, getSiteData, pageMetadata } from "@/lib/site";

export const dynamicParams = false;

type Params = Promise<{ service: string }>;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((service) => ({ service }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { service } = await params;
  const data = await getSiteData();
  const page = getServicePage(service, data);
  if (!page) return {};
  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/${page.slug}`,
    image: { url: page.image, alt: page.imageAlt },
  });
}

export default async function Page({ params }: { params: Params }) {
  const { service } = await params;
  const data = await getSiteData();
  const page = getServicePage(service, data);
  if (!page) notFound();

  const index = SERVICE_SLUGS.indexOf(page.slug);
  const related = [1, 2, 3, 4]
    .map((step) => SERVICE_SLUGS[(index + step) % SERVICE_SLUGS.length])
    .map((slug) => getServicePage(slug, data))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const url = `${SITE_URL}/${page.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: page.navLabel, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service`,
      name: page.h1,
      description: page.metaDescription,
      url,
      image: page.image,
      areaServed: data.profile.city,
      provider: { "@id": `${SITE_URL}/#business`, "@type": "BeautySalon", name: SITE_NAME },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: page.eyebrow,
        itemListElement: page.sections.flatMap((section) =>
          section.entries.flatMap((entry) =>
            entry.options.map((option) => ({
              "@type": "Offer",
              price: option.price,
              priceCurrency: "EUR",
              itemOffered: {
                "@type": "Service",
                name: option.time ? `${entry.title} (${option.time})` : entry.title,
                ...(entry.description ? { description: entry.description } : {}),
              },
            }))
          )
        ),
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ServicePage page={page} related={related} profile={data.profile} />
    </>
  );
}
