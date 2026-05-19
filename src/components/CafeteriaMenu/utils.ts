import {
  getChildNodes,
  getNodeProps,
} from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { CafeteriaMenuItem } from "./types";

export const normaliseLocaleCode = (value?: string) =>
  value?.replace(/_/g, "-");

const toLocaleCandidates = (locale?: string) => {
  if (!locale) {
    return [];
  }
  const normalised = locale.replace("_", "-");
  const [language] = normalised.split("-");
  const variants = new Set<string>();
  variants.add(normalised);
  variants.add(normalised.toLowerCase());
  variants.add(locale);
  variants.add(locale.toLowerCase());
  variants.add(locale.replace("-", "_"));
  variants.add(locale.replace("_", "-"));
  if (language) {
    variants.add(language);
    variants.add(language.toLowerCase());
  }
  return Array.from(variants).filter(Boolean);
};

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (!value || typeof value !== "object") {
    return undefined;
  }

  try {
    const getString = Reflect.get(value as Record<string, unknown>, "getString");
    if (typeof getString === "function") {
      const stringValue = getString.call(value);
      if (typeof stringValue === "string") {
        return stringValue;
      }
    }
  } catch {
    // ignore
  }

  try {
    const toStringMethod = Reflect.get(value as Record<string, unknown>, "toString");
    if (typeof toStringMethod === "function") {
      const stringValue = toStringMethod.call(value);
      if (typeof stringValue === "string" && stringValue !== "[object Object]") {
        return stringValue;
      }
    }
  } catch {
    // ignore
  }

  return undefined;
};

const getFromMapLike = (value: unknown, key: string): unknown => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  try {
    const get = Reflect.get(value as Record<string, unknown>, "get");
    if (typeof get === "function") {
      return get.call(value, key);
    }
  } catch {
    // ignore
  }

  return undefined;
};

export const resolveLocalizedString = (
  value: unknown,
  locale?: string,
): string | undefined => {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidates = toLocaleCandidates(locale);
  for (const key of candidates) {
    if (!key) {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(value, key)) {
      const candidate = (value as Record<string, unknown>)[key];
      const result = resolveLocalizedString(candidate, locale);
      if (result) {
        return result;
      }
    }

    const mapCandidate = getFromMapLike(value, key);
    if (mapCandidate !== undefined) {
      const result = resolveLocalizedString(mapCandidate, locale);
      if (result) {
        return result;
      }
    }
  }

  for (const entry of Object.values(value as Record<string, unknown>)) {
    const result = resolveLocalizedString(entry, locale);
    if (result) {
      return result;
    }
  }

  return toStringValue(value);
};

export const resolveLocalizedStringList = (
  value: unknown,
  locale?: string,
): string[] | undefined => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    const entries = value
      .map((entry) => resolveLocalizedString(entry, locale))
      .filter((entry): entry is string => Boolean(entry))
      .map((entry) => entry.trim())
      .filter(Boolean);

    return entries.length > 0 ? entries : undefined;
  }

  const raw = resolveLocalizedString(value, locale);
  if (typeof raw === "string") {
    return raw
      .split(/[,;\n\r]+/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  try {
    const getValues = Reflect.get(value as Record<string, unknown>, "getValues");
    if (typeof getValues === "function") {
      const resolvedValues = getValues.call(value);
      if (Array.isArray(resolvedValues)) {
        return resolvedValues
          .map((entry) => resolveLocalizedString(entry, locale))
          .filter((entry): entry is string => Boolean(entry))
          .map((entry) => entry.trim())
          .filter(Boolean);
      }
    }
  } catch {
    // ignore
  }

  return undefined;
};

export const sanitiseRichText = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const withoutScripts = value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  return withoutScripts.trim();
};

export const normaliseMenuDate = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
};

export const formatMenuDateLabel = (value?: string, locale = "en") => {
  if (!value) {
    return undefined;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(parsed);
  } catch {
    return value;
  }
};

export const collectMenuItems = (nodes: JCRNodeWrapper[]): JCRNodeWrapper[] => {
  const items: JCRNodeWrapper[] = [];
  nodes.forEach((node) => {
    try {
      if (node.isNodeType("euint:cafeteriaMenuItem")) {
        items.push(node);
        return;
      }

      if (node.isNodeType("jnt:contentList") || node.isNodeType("jnt:contentNodeList")) {
        const children = getChildNodes(node, -1, 0);
        if (children.length > 0) {
          items.push(...collectMenuItems(children as unknown as JCRNodeWrapper[]));
        }
      }
    } catch {
      // ignore nodes we cannot inspect
    }
  });

  return items;
};

export const resolveImageUrl = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    if (/^(?:https?:)?\//.test(value)) {
      return value;
    }
    if (value.startsWith("live/") || value.startsWith("default/")) {
      return `/files/${value}`;
    }
    return value;
  }

  if (typeof value === "object") {
    try {
      const getUrl = Reflect.get(value as Record<string, unknown>, "getUrl");
      if (typeof getUrl === "function") {
        const url = getUrl.call(value);
        if (typeof url === "string") {
          return url;
        }
      }
    } catch {
      // ignore
    }

    try {
      const getPath = Reflect.get(value as Record<string, unknown>, "getPath");
      if (typeof getPath === "function") {
        const path = getPath.call(value);
        if (typeof path === "string") {
          return `/files/default${path}`;
        }
      }
    } catch {
      // ignore
    }
  }

  return undefined;
};

export const toMenuItem = (
  node: JCRNodeWrapper,
  locale: string,
): CafeteriaMenuItem => {
  const props = getNodeProps<{
    "jcr:uuid"?: string;
    "jcr:title"?: string;
    "eui:menuDate"?: string;
    "eui:isVegan"?: string | boolean;
    "eui:allergens"?: string | string[];
    "eui:dishes"?: string;
    "eui:calories"?: string;
    "eui:image"?: string;
  }>(node, [
    "jcr:uuid",
    "jcr:title",
    "eui:menuDate",
    "eui:isVegan",
    "eui:allergens",
    "eui:dishes",
    "eui:calories",
    "eui:image",
  ]);

  const id =
    props["jcr:uuid"] ||
    (() => {
      try {
        return typeof node.getPath === "function" ? node.getPath() : undefined;
      } catch {
        return undefined;
      }
    })() ||
    (() => {
      try {
        return typeof node.getName === "function" ? node.getName() : undefined;
      } catch {
        return undefined;
      }
    })() ||
    "";

  const title =
    resolveLocalizedString(props["jcr:title"], locale) ||
    (() => {
      try {
        return typeof node.getName === "function" ? node.getName() : undefined;
      } catch {
        return undefined;
      }
    })() ||
    id;

  const rawMenuDate = props["eui:menuDate"];
  const menuDate = normaliseMenuDate(rawMenuDate);
  const isVeganRaw = props["eui:isVegan"];
  const isVegan =
    typeof isVeganRaw === "boolean"
      ? isVeganRaw
      : typeof isVeganRaw === "string"
        ? isVeganRaw === "true"
        : false;

  const allergens = resolveLocalizedStringList(props["eui:allergens"], locale);

  const dishesRaw = resolveLocalizedString(props["eui:dishes"], locale);
  const dishes = sanitiseRichText(dishesRaw);
  const calories = resolveLocalizedString(props["eui:calories"], locale) || undefined;
  const imageUrl = resolveImageUrl(props["eui:image"]);

  return {
    id,
    title,
    menuDate,
    isVegan: isVegan || undefined,
    allergens,
    dishes,
    imageUrl: imageUrl || undefined,
    calories,
  };
};

export const buildJsonLd = (
  name: string,
  items: CafeteriaMenuItem[],
  locale: string,
) => {
  const hasItems = items.length > 0;
  if (!hasItems) {
    return undefined;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name,
    inLanguage: locale,
    hasMenuItem: items.map((item) => {
      const dateProperty =
        item.menuDate && item.menuDate.length > 0
          ? [
              {
                "@type": "PropertyValue",
                name: "Menu date",
                value: item.menuDate,
              },
            ]
          : undefined;

      const nutrition =
        item.calories && item.calories.length > 0
          ? {
              "@type": "NutritionInformation",
              calories: item.calories,
            }
          : undefined;

      return Object.fromEntries(
        Object.entries({
          "@type": "MenuItem",
          identifier: item.id,
          name: item.title,
          description: sanitiseRichText(item.dishes) || undefined,
          image: item.imageUrl,
          keywords: item.allergens,
          suitableForDiet: item.isVegan ? "https://schema.org/VeganDiet" : undefined,
          additionalProperty: dateProperty,
          nutrition,
        }).filter(([, value]) => value !== undefined && value !== null && value !== ""),
      );
    }),
  };

  return JSON.stringify(jsonLd);
};
