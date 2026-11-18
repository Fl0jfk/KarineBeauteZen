import type { MetadataRoute } from "next";
import { SERVICE_SLUGS } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    ...SERVICE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${SITE_URL}/boutique`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}
