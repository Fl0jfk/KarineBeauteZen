import { cache } from "react";
import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import type { Data } from "@/app/contexts/data";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://karine-beaute-zen.com").replace(/\/$/, "");
export const SITE_NAME = "Karine Beauté Zen";
export const SITE_DESCRIPTION =
  "Institut de beauté à Saint-Pierre-des-Fleurs (Eure, 27) : soins du visage et du corps, massages, manucure, épilation, cils, maquillage et cartes cadeaux.";
export const SOCIAL_LINKS = ["https://www.facebook.com/karine.beautezen.9"];
export const DEFAULT_OG_IMAGE =
  "https://karinebeautezen.s3.eu-west-3.amazonaws.com/soins/soinscover.jpg";

export const HOME_TITLE = "Karine Beauté Zen — Institut de beauté à Saint-Pierre-des-Fleurs (27)";

export function pageMetadata({
  title,
  description,
  path: pagePath,
  image,
}: {
  /** Titre court de la page (suffixé par « | Karine Beauté Zen »). Omis pour l'accueil. */
  title?: string;
  description: string;
  path: string;
  image?: { url: string; alt: string };
}): Metadata {
  const ogImage = image ?? { url: DEFAULT_OG_IMAGE, alt: "Soins visage et corps chez Karine Beauté Zen" };
  const fullTitle = title ? `${title} | ${SITE_NAME}` : HOME_TITLE;
  return {
    title: title ?? { absolute: HOME_TITLE },
    description,
    alternates: { canonical: pagePath },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
      url: pagePath,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  };
}

export const getSiteData = cache(async (): Promise<Data> => {
  const file = path.join(process.cwd(), "public", "data.json");
  return JSON.parse(await fs.readFile(file, "utf-8")) as Data;
});

export const toE164 = (phone: string) => `+33${phone.replace(/\D/g, "").replace(/^0/, "")}`;
