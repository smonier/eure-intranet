import { buildNodeUrl } from "@jahia/javascript-modules-library";
import type { RenderContext } from "org.jahia.services.render";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { TrainingProps } from "./types";

export const formatDateTime = (value?: string, locale = "en") => {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const resolveLocale = (renderContext: RenderContext) => {
  const contextWithLocale = renderContext as unknown as {
    getUILocale?: () => unknown;
    getLocale?: () => unknown;
  };
  const localeCandidate =
    typeof contextWithLocale.getUILocale === "function"
      ? contextWithLocale.getUILocale()
      : typeof contextWithLocale.getLocale === "function"
        ? contextWithLocale.getLocale()
        : null;

  return localeCandidate && typeof (localeCandidate as { toString?: () => string }).toString === "function"
    ? (localeCandidate as { toString: () => string }).toString()
    : "en";
};

export const resolveImageUrl = (
  image: TrainingProps["eui:heroImage"],
  renderContext: RenderContext,
) => {
  if (!image) {
    return undefined;
  }
  if (typeof image === "string") {
    return image;
  }

  if ((image as JCRNodeWrapper)?.getIdentifier instanceof Function) {
    return buildNodeUrl(image as JCRNodeWrapper);
  }

  const contextWithMode = renderContext as RenderContext & {
    getMode?: () => string;
    isEditMode?: () => boolean;
  };
  const mode =
    typeof contextWithMode.getMode === "function"
      ? contextWithMode.getMode()
      : typeof contextWithMode.isEditMode === "function" && contextWithMode.isEditMode()
        ? "edit"
        : "live";
  if ((image as { getPath?: () => string })?.getPath instanceof Function) {
    return `/files/${mode === "live" ? "live" : "default"}${(image as { getPath: () => string }).getPath()}`;
  }

  return undefined;
};

export const inferAttendanceMode = (deliveryMode?: string) => {
  if (!deliveryMode) {
    return undefined;
  }

  const value = deliveryMode.toLowerCase();
  if (value.includes("hybrid")) {
    return "https://schema.org/MixedEventAttendanceMode";
  }
  if (value.includes("online") || value.includes("virtual") || value.includes("distance")) {
    return "https://schema.org/OnlineEventAttendanceMode";
  }
  return "https://schema.org/OfflineEventAttendanceMode";
};

export const normalisePrice = (cost?: string) => {
  if (!cost) {
    return undefined;
  }
  const numeric = cost.replace(/[^0-9.,]/g, "").replace(",", ".");
  const parsed = Number.parseFloat(numeric);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : undefined;
};

export const buildJsonLd = (
  props: TrainingProps,
  locale: string,
  url?: string,
  imageUrl?: string,
) => {
  const attendanceMode = inferAttendanceMode(props["eui:deliveryMode"]);
  const price = normalisePrice(props["eui:cost"]);
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TrainingEvent",
    name: props["jcr:title"],
    description: props["eui:description"] || props["eui:summary"],
    startDate: props["eui:startDate"],
    endDate: props["eui:endDate"],
    inLanguage: locale,
    eventStatus: "https://schema.org/EventScheduled",
    url: url,
    image: imageUrl,
    organizer:
      props["eui:providerName"] || props["eui:providerUrl"]
        ? {
            "@type": "Organization",
            name: props["eui:providerName"],
            url: props["eui:providerUrl"],
          }
        : undefined,
    location: props["eui:location"]
      ? {
          "@type": "Place",
          name: props["eui:location"],
        }
      : props["eui:deliveryMode"]?.toLowerCase().includes("online")
        ? {
            "@type": "VirtualLocation",
            url: url || props["eui:providerUrl"],
          }
        : undefined,
    eventAttendanceMode: attendanceMode,
    offers: price
      ? {
          "@type": "Offer",
          priceCurrency: "EUR",
          price: price,
          url: url,
        }
      : undefined,
  };

  return JSON.stringify(
    Object.fromEntries(Object.entries(base).filter(([, value]) => value !== undefined && value !== "")),
  );
};
