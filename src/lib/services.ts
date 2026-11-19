import type { Data } from "@/app/contexts/data";
import { offerFor, type Offer } from "./gift";

export type RawItem = {
  id: number;
  title: string;
  price: number;
  time?: string;
  description?: string;
};

export type PriceOption = { time?: string; price: number; offer?: Offer };

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

export type Faq = { question: string; answer: string; cta?: { label: string; href: string } };

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
  offerable: boolean;
};

type SectionSource = {
  id: string;
  title: string;
  intro?: string;
  items: RawItem[];
  noOffer?: boolean;
};

/** Données de la page, pour calculer les textes (durées, cures, noms de soins…) depuis le catalogue. */
type Ctx = {
  data: Data;
  /** Prestations de chaque rubrique, par identifiant de rubrique. */
  items: Record<string, RawItem[]>;
  /** Toutes les prestations de la page. */
  all: RawItem[];
  hasGiftCard: boolean;
};

type Content = { intro: string; highlights: string[]; faq: Faq[] };

type Config = {
  slug: string;
  navLabel: string;
  cardLabel: string;
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  imageAlt: string;
  image: (data: Data) => string | undefined;
  sections: (data: Data) => SectionSource[];
  content: (ctx: Ctx) => Content;
  notice?: { title: string; text: string };
  minIgnore?: RegExp;
  offer?: boolean;
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

// ---------- Outils de calcul des textes à partir des données ----------

const unique = <T,>(values: T[]) => [...new Set(values)];
const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const has = (items: RawItem[], pattern: RegExp) =>
  items.some((item) => pattern.test(item.title) || pattern.test(item.description ?? ""));
const compact = (values: Array<string | false | undefined | null>) =>
  values.filter((value): value is string => typeof value === "string" && value.length > 0);

const joinList = (values: string[], last = "et") =>
  values.length <= 1 ? values.join("") : `${values.slice(0, -1).join(", ")} ${last} ${values[values.length - 1]}`;

/** « a, b, c et bien d'autres » au-delà de `max` éléments, sinon « a, b et c ». */
const listWithMore = (values: string[], max: number) =>
  values.length > max ? `${values.slice(0, max).join(", ")} et bien d'autres` : joinList(values);

const sentence = (text: string) => upperFirst(text.toLowerCase());

const minutesOf = (time?: string) => {
  if (!time) return undefined;
  const hours = time.match(/(\d+)\s*heures?/i)?.[1];
  const minutes = time.match(/(\d+)\s*minutes?/i)?.[1];
  if (!hours && !minutes) return undefined;
  return (hours ? Number(hours) : 0) * 60 + (minutes ? Number(minutes) : 0);
};

/** 40 → « 40 min », 60 → « 1 h », 90 → « 1 h 30 », 65 → « 1 h 05 ». */
const spoken = (total: number) => {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
};

const durations = (items: RawItem[]) =>
  unique(items.map((item) => minutesOf(item.time)).filter((v): v is number => v !== undefined)).sort((a, b) => a - b);

const durationRange = (items: RawItem[]) => {
  const list = durations(items);
  return list.length ? { min: list[0], max: list[list.length - 1] } : undefined;
};

const cureCounts = (items: RawItem[]) =>
  unique(
    items.flatMap((item) =>
      [...`${item.title} ${item.description ?? ""}`.matchAll(/(\d+)\s*séances/gi)].map((match) => Number(match[1]))
    )
  ).sort((a, b) => a - b);

const cureText = (counts: number[]) => `${joinList(counts.map(String), "ou")} séances`;

/** Met en minuscule le début de la description et les éléments listés après une virgule (« Gommage » → « gommage »). */
const inSentence = (description: string) =>
  lowerFirst(description.replace(/\.\s*$/, "")).replace(/,\s*(\p{Lu})/gu, (_, letter: string) => `, ${letter.toLowerCase()}`);

const describe = (item: RawItem) => {
  const time = minutesOf(item.time);
  return `${item.title}${time ? ` (${spoken(time)})` : ""}${item.description ? ` : ${inSentence(item.description)}` : ""}.`;
};

// ---------- Rubriques ----------
// Les prix, durées et libellés viennent toujours de data.json ; seules les rubriques sont définies ici.
// Une prestation ajoutée dans data.json apparaît automatiquement dans « Autres prestations » de la bonne page.

const SOINS_GROUPS = {
  pausesVisage: range(1, 5),
  soinsExperts: [6, 7, 8, 9, 10, 11, 42],
  option: [44],
  massagesMonde: range(12, 21),
  massagesSignature: range(22, 30),
  bienEtre: [36, 37],
  pausesCorps: [34, 33, 32, 31],
  dos: [35],
  minceur: [38, 39, 40, 41, 43],
};
const CLAIMED_SOINS = new Set(Object.values(SOINS_GROUPS).flat());

const routeSoin = (item: RawItem): "massages" | "visage" | "corps" => {
  if (/visage|kobido|peeling|sourcil/i.test(item.title)) return "visage";
  if (/massage|reiki|r[ée]flexo/i.test(item.title)) return "massages";
  return "corps";
};
const otherSoins = (data: Data, route: "massages" | "visage" | "corps") =>
  list(data, SOINS).filter((item) => !CLAIMED_SOINS.has(item.id) && routeSoin(item) === route);

const EPILATION_GROUPS = {
  visage: range(57, 61),
  corps: range(62, 72),
  maillot: [17, 107, 112, 18],
  forfaitsVisage: [19, 20, 21],
  forfaitsCorps: range(22, 29),
};
const CLAIMED_EPILATION = new Set(Object.values(EPILATION_GROUPS).flat());

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
    imageAlt: "Massage relaxant à l'institut Karine Beauté Zen",
    image: shopImage("Massage californien"),
    sections: (data) => {
      const items = list(data, SOINS);
      return [
        {
          id: "massages-du-monde",
          title: "Massages du monde",
          intro: "Des modelages relaxants, du plus enveloppant au plus tonique.",
          items: pick(items, SOINS_GROUPS.massagesMonde),
        },
        {
          id: "massages-signature",
          title: "Massages signature & ciblés",
          items: pick(items, SOINS_GROUPS.massagesSignature),
        },
        {
          id: "bien-etre",
          title: "Réflexologie & énergétique",
          items: pick(items, SOINS_GROUPS.bienEtre),
        },
        { id: "autres", title: "Autres prestations", items: otherSoins(data, "massages") },
      ];
    },
    content: ({ items, all, hasGiftCard }) => {
      const world = items["massages-du-monde"] ?? [];
      const worldDurations = durations(world).map(spoken);
      const names = unique(all.filter((i) => /massage/i.test(i.title)).map((i) => lowerFirst(i.title))).slice(0, 6);
      const durationSentence = worldDurations.length
        ? worldDurations.length > 1
          ? ` La plupart des massages du monde existent en ${joinList(worldDurations, "ou")}.`
          : ` Les massages du monde durent ${worldDurations[0]}.`
        : "";

      const described = new Map<string, string>();
      for (const item of all) {
        if (/massage/i.test(item.title) && item.description && !described.has(item.title)) {
          described.set(item.title, item.description);
        }
      }

      return {
        intro: `Un vrai temps pour soi, du modelage le plus enveloppant au plus tonique. Au programme : ${listWithMore(names, 5)}.${durationSentence}`,
        highlights: compact([
          worldDurations.length > 0 && `Massages du monde en ${joinList(worldDurations, "ou")}`,
          has(all, /femmes enceintes/i) && "Massage adapté aux femmes enceintes",
          hasGiftCard && "Carte cadeau disponible",
        ]),
        faq: described.size
          ? [
              {
                question: "Quel massage choisir ?",
                answer: [...described]
                  .map(([title, description]) => `${title} : ${inSentence(description)}.`)
                  .join(" "),
              },
            ]
          : [],
      };
    },
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
          items: pick(items, SOINS_GROUPS.pausesVisage),
        },
        {
          id: "soins-experts",
          title: "Soins experts",
          items: pick(items, SOINS_GROUPS.soinsExperts),
        },
        { id: "autres", title: "Autres prestations", items: otherSoins(data, "visage") },
        {
          id: "option",
          title: "En option",
          items: pick(items, SOINS_GROUPS.option),
          noOffer: true,
        },
      ];
    },
    content: ({ items, all }) => {
      const pauses = items["pauses-visage"] ?? [];
      const spread = durationRange(pauses);
      const experts = unique((items["soins-experts"] ?? []).map((i) => lowerFirst(i.title)));
      const cures = cureCounts(all);

      return {
        intro: `Du coup d'éclat rapide à la parenthèse la plus complète, les pauses visage ${
          spread ? `durent de ${spoken(spread.min)} à ${spoken(spread.max)}` : "se déclinent selon vos envies"
        }.${
          experts.length ? ` Pour aller plus loin : ${listWithMore(experts, 4)}.` : ""
        }`,
        highlights: compact([
          spread && `Pauses visage de ${spoken(spread.min)} à ${spoken(spread.max)}`,
          has(all, /anti-?[âa]ge/i) && has(all, /anti-taches/i) && "Soins anti-âge et anti-taches",
          cures.length > 0 && `Cures de ${cureText(cures)}`,
        ]),
        faq: pauses.length > 1
          ? [
              {
                question: "Quelle différence entre les pauses visage ?",
                answer: `Elles sont progressives. ${pauses.map(describe).join(" ")}`,
              },
            ]
          : [],
      };
    },
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
    imageAlt: "Soin du corps à l'institut Karine Beauté Zen",
    image: shopImage("Massage ayurvédique"),
    sections: (data) => {
      const items = list(data, SOINS);
      return [
        {
          id: "pauses-corps",
          title: "Les pauses corps",
          intro: "Gommage, enveloppement, massage : le corps se détend, la peau retrouve sa douceur.",
          items: pick(items, SOINS_GROUPS.pausesCorps),
        },
        { id: "soin-du-dos", title: "Soin du dos", items: pick(items, SOINS_GROUPS.dos) },
        {
          id: "minceur",
          title: "Minceur & jambes légères",
          intro: "Des soins ciblés, avec des tarifs dégressifs en cure.",
          items: pick(items, SOINS_GROUPS.minceur),
        },
        { id: "autres", title: "Autres prestations", items: otherSoins(data, "corps") },
      ];
    },
    content: ({ items, all }) => {
      const pauses = items["pauses-corps"] ?? [];
      const spread = durationRange(pauses);
      const pauseNames = unique(pauses.map((i) => lowerFirst(i.title)));
      const targeted = unique((items["minceur"] ?? []).map((i) => lowerFirst(i.title)));
      const cures = cureCounts(all);
      const withCure = unique(all.filter((i) => cureCounts([i]).length > 0).map((i) => lowerFirst(i.title)));

      return {
        intro: `${
          pauseNames.length
            ? `Détente et douceur de la peau avec ${joinList(pauseNames)}${
                spread ? `, de ${spoken(spread.min)} à ${spoken(spread.max)}` : ""
              }.`
            : "Des soins du corps pour se ressourcer."
        }${targeted.length ? ` Côté silhouette et jambes légères : ${joinList(targeted)}.` : ""}${
          cures.length ? ` Plusieurs soins sont proposés en cure de ${cureText(cures)}.` : ""
        }`,
        highlights: compact([
          spread && `Pauses corps de ${spoken(spread.min)} à ${spoken(spread.max)}`,
          has(all, /mad[ée]roth[ée]rapie/i) && has(all, /pressoth[ée]rapie/i) && "Madérothérapie & pressothérapie",
          cures.length > 0 && `Cures de ${cureText(cures)}`,
        ]),
        faq: cures.length
          ? [
              {
                question: "Les cures de plusieurs séances sont-elles avantageuses ?",
                answer: `Oui : ${joinList(withCure)} sont proposés en forfaits de ${cureText(cures)} à tarif réduit. Le détail est indiqué sous chaque soin.`,
              },
            ]
          : [],
      };
    },
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
    content: ({ data, items, all }) => {
      const skills = compact([
        has(all, /\bgel\b/i) && "pose de gel",
        has(all, /capsule/i) && "capsules",
        has(all, /semi.?permanent/i) && "vernis semi-permanent",
        has(all, /french/i) && "French",
        has(all, /strass/i) && "strass",
        has(all, /sticker/i) && "stickers",
      ]);
      const specialist = data.team.some((member) => /onglerie/i.test(member.profession));
      const naturals = items["ongles-naturels"] ?? [];

      return {
        intro: `${specialist ? `${data.profile.firstname} est spécialiste de l'onglerie` : "L'institut propose l'onglerie"}${
          skills.length ? ` : ${joinList(skills)}` : ""
        }, mais aussi soins des ongles naturels, des mains et des pieds. Chaque prestation est détaillée ci-dessous.`,
        highlights: compact([
          has(all, /\bgel\b/i) && has(all, /capsule/i) && has(all, /semi.?permanent/i) && "Gel, capsules & semi-permanent",
          has(all, /pieds/i) && has(all, /mains/i) && "Soins des mains et des pieds",
          (items["depose"] ?? []).length > 0 && "Dépose en institut",
        ]),
        faq: has(naturals, /votre vernis/i)
          ? [
              {
                question: "Puis-je venir avec mon propre vernis ?",
                answer:
                  "Oui, une pose de vernis naturel mains et pieds est prévue si vous apportez votre vernis (ou si vous choisissez un vernis de l'institut). Les tarifs sont indiqués dans la rubrique « Ongles naturels, mains & pieds ».",
              },
            ]
          : [],
      };
    },
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
    imageAlt: "Épilation à l'institut Karine Beauté Zen",
    image: cover(2),
    offer: false,
    sections: (data) => {
      const items = list(data, "Épilations");
      return [
        { id: "visage", title: "Visage", items: pick(items, EPILATION_GROUPS.visage) },
        { id: "corps", title: "Corps", items: pick(items, EPILATION_GROUPS.corps) },
        { id: "maillot", title: "Maillot", items: pick(items, EPILATION_GROUPS.maillot) },
        {
          id: "forfaits-visage",
          title: "Forfaits visage",
          items: pick(items, EPILATION_GROUPS.forfaitsVisage),
        },
        {
          id: "forfaits-corps",
          title: "Forfaits corps",
          intro: "Aisselles + jambes + maillot : le combo gagnant.",
          items: pick(items, EPILATION_GROUPS.forfaitsCorps),
        },
        { id: "autres", title: "Autres zones", items: items.filter((item) => !CLAIMED_EPILATION.has(item.id)) },
      ];
    },
    content: ({ items }) => {
      const zones = [...(items["visage"] ?? []), ...(items["corps"] ?? []), ...(items["maillot"] ?? []), ...(items["autres"] ?? [])];
      const forfaits = [...(items["forfaits-visage"] ?? []), ...(items["forfaits-corps"] ?? [])];
      const areas = compact([
        (items["visage"] ?? []).length > 0 && "visage",
        (items["corps"] ?? []).length > 0 && "corps",
        (items["maillot"] ?? []).length > 0 && "maillot",
      ]);
      const maillot = items["maillot"] ?? [];
      const suffix = (item: RawItem) => item.title.replace(/^maillot\s+/i, "");

      return {
        intro: `${upperFirst(joinList(areas, "et"))} : une grille de prix claire, zone par zone${
          forfaits.length ? ", et des forfaits pour épiler plusieurs zones à tarif avantageux" : ""
        }. Une première visite se fait simplement sur rendez-vous.`,
        highlights: compact([
          zones.length > 0 && `${zones.length} zones à la carte`,
          maillot.length > 1 && `Maillot ${suffix(maillot[0])} à ${suffix(maillot[maillot.length - 1])}`,
          forfaits.length > 0 && `${forfaits.length} forfaits`,
        ]),
        faq: zones.length
          ? [
              {
                question: "Quelles zones puis-je faire épiler ?",
                answer: `${upperFirst(joinList(unique(zones.map((z) => z.title.toLowerCase()))))}.${
                  forfaits.length ? " Des forfaits associent plusieurs zones à tarif réduit." : ""
                }`,
              },
            ]
          : [],
      };
    },
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
    content: ({ items }) => {
      const tint = items["teinture-rehaussement"] ?? [];
      const extensions = items["extensions"] ?? [];
      const poses = unique(extensions.filter((i) => !/remplissage/i.test(i.title)).map((i) => i.title));
      const weeks = unique(
        extensions.flatMap((i) => [...i.title.matchAll(/(\d+)\s*semaines?/gi)].map((match) => Number(match[1])))
      ).sort((a, b) => a - b);
      const parts = compact([
        has(tint, /teinture/i) && "teinture",
        has(tint, /r[ée]haussement/i) && "rehaussement de cils",
        has(tint, /brow lift/i) && "brow lift",
        poses.length > 0 && `extensions de cils (${joinList(poses.map((p) => p.toLowerCase()), "ou")})`,
      ]);
      const natural = poses.find((p) => /naturelle/i.test(p));
      const russian = poses.find((p) => /russe/i.test(p));

      return {
        intro: `Un regard structuré et lumineux${parts.length ? ` : ${joinList(parts)}` : ""}${
          weeks.length ? `, avec remplissage toutes les ${joinList(weeks.map(String), "ou")} semaines` : ""
        }.`,
        highlights: compact([
          poses.length > 0 && joinList(poses, "&"),
          has(tint, /r[ée]haussement/i) && has(tint, /brow lift/i) && "Rehaussement de cils & brow lift",
          weeks.length > 0 && `Remplissage ${joinList(weeks.map(String), "ou")} semaines`,
        ]),
        faq:
          natural && russian
            ? [
                {
                  question: `${sentence(natural)} ou ${russian.toLowerCase()} ?`,
                  answer: `${sentence(natural)} : allonge et densifie discrètement vos cils pour un effet « mascara ». ${sentence(russian)} : plus dense et plus intense, pour un regard très fourni.${
                    weeks.length ? ` Un remplissage est conseillé toutes les ${joinList(weeks.map(String), "à")} semaines.` : ""
                  }`,
                },
              ]
            : [],
      };
    },
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
    imageAlt: "Maquillage à l'institut Karine Beauté Zen",
    image: cover(4),
    sections: (data) => [{ id: "maquillage", title: "Nos maquillages", items: list(data, "Maquillage") }],
    content: ({ all }) => {
      const bride = all.find((i) => /mari[ée]e/i.test(i.title));
      const course = all.find((i) => /cours/i.test(i.title));

      return {
        intro: `Pour un événement, une soirée ou le plus beau jour de votre vie : ${joinList(
          unique(all.map((i) => lowerFirst(i.title)))
        )}.`,
        highlights: compact([
          bride && bride.title,
          course && course.title,
          has(all, /jour/i) && has(all, /nuit|soir/i) && "Jour & nuit",
        ]),
        faq:
          bride && /essai/i.test(bride.title)
            ? [
                {
                  question: "Le maquillage de mariée comprend-il un essai ?",
                  answer:
                    "Oui, un essai est compris dans le tarif du maquillage de mariée. Contactez l'institut pour fixer les dates de l'essai et du jour J.",
                },
              ]
            : [],
      };
    },
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
    imageAlt: "Solarium de l'institut Karine Beauté Zen",
    image: cover(5),
    offer: false,
    minIgnore: /lunettes/i,
    sections: (data) => [{ id: "solarium", title: "Tarifs", items: list(data, "Solarium") }],
    notice: { title: "Attention", text: SOLARIUM_WARNING },
    content: ({ all }) => {
      const glasses = all.find((i) => /lunettes/i.test(i.title));

      return {
        intro: `Un appareil de bronzage en institut${has(all, /séance/i) ? ", à la séance" : ""}. Interdit aux personnes de moins de 18 ans.`,
        highlights: compact([
          has(all, /séance/i) && "Tarif à la séance",
          glasses && "Lunettes de protection",
          "Réservé aux majeurs",
        ]),
        faq: glasses
          ? [
              {
                question: "Les lunettes de protection sont-elles nécessaires ?",
                answer: `Oui, le port de lunettes de protection est requis pendant la séance. Une paire est disponible à l'institut (${formatPrice(glasses.price)}).`,
              },
            ]
          : [],
      };
    },
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

function toEntries(items: RawItem[], shop: Data["shop"], withOffer: boolean): Entry[] {
  const entries: Entry[] = [];
  for (const item of items) {
    const previous = entries[entries.length - 1];
    const time = formatDuration(item.time);
    const option: PriceOption = { time, price: item.price };
    if (withOffer) option.offer = offerFor({ title: item.title, price: item.price, time }, shop);
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

  const source = config.sections(data);
  const sections = source
    .filter((s) => s.items.length)
    .map((s) => ({
      id: s.id,
      title: s.title,
      intro: s.intro,
      entries: toEntries(s.items, data.shop, config.offer !== false && !s.noOffer),
    }));
  const all = source.flatMap((s) => s.items);
  const prices = all.filter((item) => !config.minIgnore?.test(item.title)).map((item) => item.price);

  const content = config.content({
    data,
    items: Object.fromEntries(source.map((s) => [s.id, s.items])),
    all,
    hasGiftCard: data.shop.some((item) => item.title === "Carte cadeau"),
  });

  return {
    slug: config.slug,
    navLabel: config.navLabel,
    cardLabel: config.cardLabel,
    eyebrow: config.eyebrow,
    h1: config.h1,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    intro: content.intro,
    image: config.image(data) ?? data.categories[0]?.img ?? "",
    imageAlt: config.imageAlt,
    highlights: content.highlights,
    sections,
    faq: content.faq,
    notice: config.notice,
    minPrice: prices.length ? Math.min(...prices) : 0,
    count: sections.reduce((n, s) => n + s.entries.length, 0),
    offerable: sections.some((s) => s.entries.some((e) => e.options.some((o) => o.offer))),
  };
}
