import type { Data } from "@/app/contexts/data";

export type RawItem = {
  id: number;
  title: string;
  price: number;
  time?: string;
  description?: string;
};

export type PriceOption = { time?: string; price: number };

export type Entry = {
  key: string;
  title: string;
  description?: string;
  options: PriceOption[];
};

export type Section = {
  id: string;
  title: string;
  intro?: string;
  entries: Entry[];
};

export type Faq = { question: string; answer: string };

export type ServicePageData = {
  slug: string;
  navLabel: string;
  cardLabel: string;
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  sections: Section[];
  faq: Faq[];
  notice?: { title: string; text: string };
  minPrice: number;
  count: number;
};

type Config = {
  slug: string;
  navLabel: string;
  cardLabel: string;
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  highlights: string[];
  imageAlt: string;
  image: (data: Data) => string | undefined;
  sections: (data: Data) => Array<{ id: string; title: string; intro?: string; items: RawItem[] }>;
  faq: Faq[];
  notice?: { title: string; text: string };
  minIgnore?: RegExp;
};

const SOLARIUM_WARNING =
  "L'exposition aux rayonnements d'un appareil de bronzage peut provoquer des cancers de la peau et des yeux et est responsable d'un vieillissement cutané prématuré. L'existence d'une réglementation du bronzage artificiel ne permet pas d'éliminer les risques sanitaires encourus en cas d'exposition, en particulier le risque de cancer. L'utilisation de ces appareils est interdite aux personnes de moins de 18 ans. Porter les lunettes de protection fournies.";

const catalog = (data: Data) => data.prestations[0] as unknown as Record<string, unknown>;
const list = (data: Data, key: string) => (catalog(data)[key] as RawItem[] | undefined) ?? [];
const pick = (items: RawItem[], ids: number[]) =>
  ids.map((id) => items.find((item) => item.id === id)).filter((item): item is RawItem => !!item);
const cover = (index: number) => (data: Data) => data.categories[index]?.img;
const shopImage = (title: string) => (data: Data) => data.shop.find((s) => s.title === title)?.image;
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

const SOINS = "Les soins visages et corps";
const manucureGroup = (data: Data, key: string) => {
  const nested = (catalog(data).Manucure as Array<Record<string, RawItem[]>> | undefined)?.[0];
  return nested?.[key] ?? [];
};

export const SERVICE_CONFIGS: Config[] = [
  {
    slug: "massages",
    navLabel: "Massages",
    cardLabel: "Massages & bien-être",
    eyebrow: "Massages & bien-être",
    h1: "Massages à Saint-Pierre-des-Fleurs",
    metaTitle: "Massages à Saint-Pierre-des-Fleurs (27) : tarifs et durées",
    metaDescription:
      "Massage californien, balinais, ayurvédique, hawaïen, pierres chaudes, massage à 4 mains… Découvrez tous les tarifs des massages chez Karine Beauté Zen à Saint-Pierre-des-Fleurs.",
    intro:
      "Du massage californien aux pierres chaudes, en passant par le balinais, l'ayurvédique ou le massage à quatre mains : une carte de modelages pensée pour relâcher les tensions et s'accorder un vrai temps pour soi. La plupart des massages du monde existent en 1 h ou 1 h 30.",
    highlights: ["Massages du monde en 1 h ou 1 h 30", "Massage adapté aux femmes enceintes", "Carte cadeau disponible"],
    imageAlt: "Massage relaxant à l'institut Karine Beauté Zen",
    image: shopImage("Massage californien"),
    sections: (data) => {
      const items = list(data, SOINS);
      return [
        {
          id: "massages-du-monde",
          title: "Massages du monde",
          intro: "Des modelages relaxants, du plus enveloppant au plus tonique.",
          items: pick(items, range(12, 21)),
        },
        {
          id: "massages-signature",
          title: "Massages signature & ciblés",
          items: pick(items, range(22, 30)),
        },
        {
          id: "bien-etre",
          title: "Réflexologie & énergétique",
          items: pick(items, [36, 37]),
        },
      ];
    },
    faq: [
      {
        question: "Quel massage choisir ?",
        answer:
          "Pour une détente enveloppante, optez pour le californien ou l'oriental (manœuvres lentes et douces). Le balinais dénoue les contractions avec des étirements de type thaï doux, l'ayurvédique est plus énergétique et le hawaïen, inspiré du Lomi-Lomi, relâche les tensions. Le massage latéral convient aux femmes enceintes.",
      },
    ],
  },
  {
    slug: "soins-du-visage",
    navLabel: "Soins du visage",
    cardLabel: "Soins du visage",
    eyebrow: "Soins du visage",
    h1: "Soins du visage à Saint-Pierre-des-Fleurs",
    metaTitle: "Soins du visage à Saint-Pierre-des-Fleurs (27) : tarifs",
    metaDescription:
      "Pauses visage, massage Kobido, radiofréquence, soins anti-âge et anti-taches : tarifs et durées des soins du visage chez Karine Beauté Zen, institut à Saint-Pierre-des-Fleurs.",
    intro:
      "Nettoyage, gommage, masque, massage : les pauses visage se déclinent de 40 minutes à plus d'1 h 40 selon vos envies. Pour aller plus loin, l'institut propose aussi le massage Kobido, la radiofréquence, la madérothérapie et des soins ciblés anti-âge ou anti-taches.",
    highlights: ["Pauses visage de 40 min à 1 h 40", "Soins anti-âge et anti-taches", "Cures de 5 séances"],
    imageAlt: "Soin du visage à l'institut Karine Beauté Zen",
    image: cover(0),
    minIgnore: /vapozone/i,
    sections: (data) => {
      const items = list(data, SOINS);
      return [
        {
          id: "pauses-visage",
          title: "Les pauses visage",
          intro: "Des soins complets, du coup d'éclat rapide à la parenthèse la plus douce.",
          items: pick(items, range(1, 5)),
        },
        {
          id: "soins-experts",
          title: "Soins experts",
          items: pick(items, [6, 7, 8, 9, 10, 11, 42]),
        },
        {
          id: "option",
          title: "En option",
          items: pick(items, [44]),
        },
      ];
    },
    faq: [
      {
        question: "Quelle différence entre les pauses visage ?",
        answer:
          "Elles sont progressives : la pause relaxante associe nettoyage, gommage et massage ; la pause clarté ajoute un masque ; détente et évasion intègrent un sérum concentré d'actifs et un soin du contour des yeux ; la pause douceur inclut aussi un massage du dos, du décolleté et des épaules.",
      },
    ],
  },
  {
    slug: "soins-du-corps",
    navLabel: "Soins du corps",
    cardLabel: "Soins du corps & minceur",
    eyebrow: "Soins du corps & minceur",
    h1: "Soins du corps et minceur à Saint-Pierre-des-Fleurs",
    metaTitle: "Soins du corps et minceur à Saint-Pierre-des-Fleurs (27)",
    metaDescription:
      "Gommage, enveloppement, madérothérapie, pressothérapie, massage amincissant, soin jambes légères : tarifs des soins du corps chez Karine Beauté Zen à Saint-Pierre-des-Fleurs.",
    intro:
      "Gommage, enveloppement et massage du corps pour se ressourcer, mais aussi soins silhouette et jambes légères : madérothérapie, pressothérapie, palper-rouler. Plusieurs soins sont proposés en cure de 5 ou 10 séances.",
    highlights: ["Pauses corps de 1 h à 3 h", "Madérothérapie & pressothérapie", "Cures de 5 ou 10 séances"],
    imageAlt: "Soin du corps à l'institut Karine Beauté Zen",
    image: shopImage("Massage ayurvédique"),
    sections: (data) => {
      const items = list(data, SOINS);
      return [
        {
          id: "pauses-corps",
          title: "Les pauses corps",
          intro: "Gommage, enveloppement, massage : le corps se détend, la peau retrouve sa douceur.",
          items: pick(items, [34, 33, 32, 31]),
        },
        { id: "soin-du-dos", title: "Soin du dos", items: pick(items, [35]) },
        {
          id: "minceur",
          title: "Minceur & jambes légères",
          intro: "Des soins ciblés, avec des tarifs dégressifs en cure.",
          items: pick(items, [38, 39, 40, 41, 43]),
        },
      ];
    },
    faq: [
      {
        question: "Les cures de plusieurs séances sont-elles avantageuses ?",
        answer:
          "Oui : la pressothérapie, la madérothérapie, le massage amincissant et le soin jambes légères sont proposés en forfaits de 5 ou 10 séances à tarif réduit. Le détail est indiqué sous chaque soin.",
      },
    ],
  },
  {
    slug: "manucure-pedicure",
    navLabel: "Manucure & pieds",
    cardLabel: "Manucure & pieds",
    eyebrow: "Onglerie",
    h1: "Manucure et pédicure à Saint-Pierre-des-Fleurs",
    metaTitle: "Manucure, pédicure et pose de gel à Saint-Pierre-des-Fleurs (27)",
    metaDescription:
      "Vernis semi-permanent, pose de gel, capsules, dépose, soin des pieds et manucure complète : tous les tarifs de l'onglerie chez Karine Beauté Zen à Saint-Pierre-des-Fleurs.",
    intro:
      "Karine est spécialiste de l'onglerie : pose de gel et de capsules, vernis semi-permanent, French, strass et stickers, mais aussi soins des ongles naturels, des mains et des pieds. Chaque prestation est détaillée ci-dessous.",
    highlights: ["Gel, capsules & semi-permanent", "Soins des mains et des pieds", "Dépose en institut"],
    imageAlt: "Manucure à l'institut Karine Beauté Zen",
    image: cover(1),
    minIgnore: /strass|^Ajout d|Réparation/i,
    sections: (data) => [
      {
        id: "gel-semi-permanent",
        title: "Gel & semi-permanent",
        intro: "Mains et pieds : pose, remplissage, réparation et décoration.",
        items: manucureGroup(data, "Gel et Semi Permanent Mains et Pieds"),
      },
      {
        id: "depose",
        title: "Dépose",
        items: manucureGroup(data, "Dépose Gel et Semi Permanent Mains et Pieds"),
      },
      {
        id: "ongles-naturels",
        title: "Ongles naturels, mains & pieds",
        items: manucureGroup(data, "Pour les ongles naturels"),
      },
    ],
    faq: [
      {
        question: "Puis-je venir avec mon propre vernis ?",
        answer:
          "Oui, une pose de vernis naturel mains et pieds est prévue si vous apportez votre vernis (ou si vous choisissez un vernis de l'institut). Les tarifs sont indiqués dans la rubrique « Ongles naturels ».",
      },
    ],
  },
  {
    slug: "epilation",
    navLabel: "Épilation",
    cardLabel: "Épilation",
    eyebrow: "Épilation",
    h1: "Épilation à Saint-Pierre-des-Fleurs",
    metaTitle: "Épilation à Saint-Pierre-des-Fleurs (27) : tarifs visage, corps et maillot",
    metaDescription:
      "Épilation sourcils, lèvres, aisselles, jambes, maillot (simple, échancré, intégral) et forfaits : consultez la grille tarifaire de Karine Beauté Zen à Saint-Pierre-des-Fleurs.",
    intro:
      "Visage, corps, maillot : une grille de prix claire, zone par zone, et des forfaits pour épiler plusieurs zones à tarif avantageux. Une première visite se fait simplement sur rendez-vous.",
    highlights: ["Tarifs zone par zone", "Maillot simple à intégral", "Forfaits avantageux"],
    imageAlt: "Épilation à l'institut Karine Beauté Zen",
    image: cover(2),
    sections: (data) => {
      const items = list(data, "Épilations");
      return [
        { id: "visage", title: "Visage", items: pick(items, range(57, 61)) },
        { id: "corps", title: "Corps", items: pick(items, range(62, 72)) },
        { id: "maillot", title: "Maillot", items: pick(items, [17, 107, 112, 18]) },
        {
          id: "forfaits-visage",
          title: "Forfaits visage",
          items: pick(items, [19, 20, 21]),
        },
        {
          id: "forfaits-corps",
          title: "Forfaits corps",
          intro: "Aisselles + jambes + maillot : le combo gagnant.",
          items: pick(items, range(22, 29)),
        },
      ];
    },
    faq: [
      {
        question: "Quelles zones puis-je faire épiler ?",
        answer:
          "Sourcils, lèvres, menton, joues, oreilles, aisselles, bras, torse, dos, fesses, jambes et maillot (simple, échancré, semi-intégral ou intégral). Des forfaits associent plusieurs zones à tarif réduit.",
      },
    ],
  },
  {
    slug: "cils-et-sourcils",
    navLabel: "Cils & sourcils",
    cardLabel: "Cils & sourcils",
    eyebrow: "Regard",
    h1: "Cils et sourcils à Saint-Pierre-des-Fleurs",
    metaTitle: "Extensions de cils, rehaussement et teinture à Saint-Pierre-des-Fleurs (27)",
    metaDescription:
      "Extensions de cils (pose naturelle, volume russe), rehaussement de cils, brow lift, teinture de cils et sourcils : tarifs chez Karine Beauté Zen à Saint-Pierre-des-Fleurs.",
    intro:
      "Un regard structuré et lumineux : teinture, rehaussement de cils, brow lift, extensions de cils en pose naturelle ou volume russe, avec remplissage toutes les 3 ou 4 semaines.",
    highlights: ["Pose naturelle & volume russe", "Rehaussement de cils & brow lift", "Remplissage 3 ou 4 semaines"],
    imageAlt: "Soin des cils et sourcils à l'institut Karine Beauté Zen",
    image: cover(3),
    sections: (data) => [
      {
        id: "teinture-rehaussement",
        title: "Teinture & rehaussement",
        items: list(data, "Teinture de sourcils et cils, réhaussement de cils"),
      },
      {
        id: "extensions",
        title: "Extensions de cils",
        intro: "Pose et remplissage.",
        items: list(data, "Extensions de cils"),
      },
    ],
    faq: [
      {
        question: "Pose naturelle ou volume russe ?",
        answer:
          "La pose naturelle allonge et densifie discrètement vos cils pour un effet « mascara ». Le volume russe, plus dense et plus intense, convient si vous recherchez un regard très fourni. Un remplissage est conseillé toutes les 3 à 4 semaines.",
      },
    ],
  },
  {
    slug: "maquillage",
    navLabel: "Maquillage",
    cardLabel: "Maquillage",
    eyebrow: "Maquillage",
    h1: "Maquillage à Saint-Pierre-des-Fleurs",
    metaTitle: "Maquillage jour, soirée et mariée à Saint-Pierre-des-Fleurs (27)",
    metaDescription:
      "Maquillage de jour, de nuit, de mariée (essai compris) et cours d'automaquillage : tarifs chez Karine Beauté Zen, institut de beauté à Saint-Pierre-des-Fleurs.",
    intro:
      "Pour un événement, une soirée ou le plus beau jour de votre vie : maquillage de jour ou de nuit, maquillage de mariée avec essai, ou cours d'automaquillage pour apprendre les bons gestes.",
    highlights: ["Maquillage de mariée avec essai", "Cours d'automaquillage (1 h)", "Jour & soirée"],
    imageAlt: "Maquillage à l'institut Karine Beauté Zen",
    image: cover(4),
    sections: (data) => [{ id: "maquillage", title: "Nos maquillages", items: list(data, "Maquillage") }],
    faq: [
      {
        question: "Le maquillage de mariée comprend-il un essai ?",
        answer:
          "Oui, un essai est compris dans le tarif du maquillage de mariée. Contactez l'institut pour fixer les dates de l'essai et du jour J.",
      },
    ],
  },
  {
    slug: "solarium",
    navLabel: "Solarium",
    cardLabel: "Solarium",
    eyebrow: "Solarium",
    h1: "Solarium à Saint-Pierre-des-Fleurs",
    metaTitle: "Solarium à Saint-Pierre-des-Fleurs (27) : tarif de la séance",
    metaDescription:
      "Séance de solarium et lunettes de protection : tarifs chez Karine Beauté Zen à Saint-Pierre-des-Fleurs. Interdit aux moins de 18 ans.",
    intro: "Un appareil de bronzage en institut, à la séance. Interdit aux personnes de moins de 18 ans.",
    highlights: ["Tarif à la séance", "Lunettes de protection", "Réservé aux majeurs"],
    imageAlt: "Solarium de l'institut Karine Beauté Zen",
    image: cover(5),
    minIgnore: /lunettes/i,
    sections: (data) => [{ id: "solarium", title: "Tarifs", items: list(data, "Solarium") }],
    notice: { title: "Attention", text: SOLARIUM_WARNING },
    faq: [
      {
        question: "Les lunettes de protection sont-elles nécessaires ?",
        answer:
          "Oui, le port de lunettes de protection est requis pendant la séance. Une paire est disponible à l'institut.",
      },
    ],
  },
];

export const SERVICE_SLUGS = SERVICE_CONFIGS.map((c) => c.slug);

export const SERVICE_LINKS = SERVICE_CONFIGS.map(({ slug, navLabel, cardLabel }) => ({
  slug,
  href: `/${slug}`,
  navLabel,
  cardLabel,
}));

export function formatDuration(time?: string) {
  if (!time) return undefined;
  const hours = time.match(/(\d+)\s*heures?/i)?.[1];
  const minutes = time.match(/(\d+)\s*minutes?/i)?.[1];
  if (hours && minutes) return `${hours}h${minutes.padStart(2, "0")}`;
  if (hours) return `${hours}h`;
  if (minutes) return `${minutes} min`;
  return time;
}

export function formatPrice(price: number) {
  return `${Number.isInteger(price) ? price : price.toFixed(2).replace(".", ",")} €`;
}

function toEntries(items: RawItem[]): Entry[] {
  const entries: Entry[] = [];
  for (const item of items) {
    const previous = entries[entries.length - 1];
    const option = { time: formatDuration(item.time), price: item.price };
    if (previous && previous.title === item.title && previous.description === (item.description || undefined)) {
      previous.options.push(option);
    } else {
      entries.push({
        key: `${item.id}-${item.title}`,
        title: item.title,
        description: item.description || undefined,
        options: [option],
      });
    }
  }
  return entries;
}

export function getServicePage(slug: string, data: Data): ServicePageData | undefined {
  const config = SERVICE_CONFIGS.find((c) => c.slug === slug);
  if (!config) return undefined;

  const sections = config
    .sections(data)
    .filter((s) => s.items.length)
    .map((s) => ({ id: s.id, title: s.title, intro: s.intro, entries: toEntries(s.items) }));
  const prices = config
    .sections(data)
    .flatMap((s) => s.items)
    .filter((item) => !config.minIgnore?.test(item.title))
    .map((item) => item.price);

  return {
    slug: config.slug,
    navLabel: config.navLabel,
    cardLabel: config.cardLabel,
    eyebrow: config.eyebrow,
    h1: config.h1,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    intro: config.intro,
    image: config.image(data) ?? data.categories[0]?.img ?? "",
    imageAlt: config.imageAlt,
    highlights: config.highlights,
    sections,
    faq: config.faq,
    notice: config.notice,
    minPrice: prices.length ? Math.min(...prices) : 0,
    count: sections.reduce((n, s) => n + s.entries.length, 0),
  };
}
