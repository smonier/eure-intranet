import { buildNodeUrl } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { RenderContext } from "org.jahia.services.render";
import type { JobPostingProps } from "./types";

export const resolveLocale = (renderContext: RenderContext) => {
  const contextWithLocale = renderContext as RenderContext & { getUILocale?: () => unknown };
  if (contextWithLocale && typeof contextWithLocale.getUILocale === "function") {
    const value = contextWithLocale.getUILocale();
    if (typeof value === "string") {
      return value;
    }
  }
  return "en";
};

export const parseDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
};

export const formatDate = (value: string | undefined, locale: string, options?: Intl.DateTimeFormatOptions) => {
  const date = parseDate(value);
  if (!date) return undefined;
  return date.toLocaleDateString(
    locale,
    options ?? {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );
};

export const formatTime = (value: string | undefined, locale: string, options?: Intl.DateTimeFormatOptions) => {
  const date = parseDate(value);
  if (!date) return undefined;
  return date.toLocaleTimeString(
    locale,
    options ?? {
      hour: "numeric",
      minute: "2-digit",
    },
  );
};

export const toIsoDate = (value: string | undefined) => {
  const date = parseDate(value);
  return date ? date.toISOString() : undefined;
};

export const toNumber = (value: string | undefined) => {
  if (!value) return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const stripHtml = (value: string | undefined) => {
  if (!value) return undefined;
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
};

export const formatSalary = (props: JobPostingProps, locale: string) => {
  if (props["eui:salaryRange"]) {
    return props["eui:salaryRange"];
  }

  const currency = props["eui:salaryCurrency"];
  const min = toNumber(props["eui:salaryMin"]);
  const max = toNumber(props["eui:salaryMax"]);

  if (!currency || (min === undefined && max === undefined)) {
    return undefined;
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (min !== undefined && max !== undefined) {
    return `${formatter.format(min)} – ${formatter.format(max)}`;
  }

  if (min !== undefined) {
    return formatter.format(min);
  }

  if (max !== undefined) {
    return formatter.format(max);
  }

  return undefined;
};

export type ResolvedLink = {
  href?: string;
  target?: string;
  rel?: string;
};

const buildInternalUrl = (value: JCRNodeWrapper | string | null | undefined) => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object" && "getPath" in value && typeof value.getPath === "function") {
    return buildNodeUrl(value as JCRNodeWrapper);
  }
  return undefined;
};

export const resolveApplyLink = (props: JobPostingProps): ResolvedLink => {
  const linkType = props["seu:linkType"];
  const linkTarget =
    props["seu:linkTarget"] && props["seu:linkTarget"] !== "_self"
      ? props["seu:linkTarget"]
      : undefined;
  const directUrl = typeof props["eui:applyUrl"] === "string" ? props["eui:applyUrl"] : undefined;
  const internalLink = props["seu:internalLink"];
  const externalLink = props["seu:externalLink"];

  let href: string | undefined;

  if (linkType === "externalLink" && typeof externalLink === "string") {
    href = externalLink;
  } else if (linkType === "internalLink" && internalLink) {
    href = buildInternalUrl(internalLink as JCRNodeWrapper | string | null);
  } else if (linkType === "self") {
    href = "#";
  } else if (!linkType) {
    // Legacy or fallback behaviour
    href =
      directUrl ||
      buildInternalUrl(internalLink as JCRNodeWrapper | string | null) ||
      (typeof externalLink === "string" ? externalLink : undefined);
  }

  if (!href) {
    href = directUrl;
  }

  const rel = linkTarget === "_blank" ? "noopener noreferrer" : undefined;

  return { href, target: linkTarget, rel };
};

const compactObject = (input: Record<string, unknown>): Record<string, unknown> => {
  const entries = Object.entries(input)
    .map(([key, value]): [string, unknown] | null => {
      if (Array.isArray(value)) {
        const cleanedArray = value
          .map((item): unknown => {
            if (item && typeof item === "object" && !Array.isArray(item)) {
              const compacted = compactObject(item as Record<string, unknown>);
              return Object.keys(compacted).length > 0 ? compacted : undefined;
            }
            return item;
          })
          .filter(
            (item) =>
              item !== undefined &&
              item !== null &&
              item !== "" &&
              (!(Array.isArray(item)) || item.length > 0),
          );

        if (cleanedArray.length === 0) {
          return null;
        }

        return [key, cleanedArray as unknown[]];
      }

      if (value && typeof value === "object") {
        const compacted = compactObject(value as Record<string, unknown>);
        if (Object.keys(compacted).length === 0) {
          return null;
        }
        return [key, compacted];
      }

      if (value === undefined || value === null || value === "") {
        return null;
      }

      return [key, value];
    })
    .filter((entry): entry is [string, unknown] => entry !== null);

  return Object.fromEntries(entries);
};

export const buildJobPostingJsonLd = (
  props: JobPostingProps,
  locale: string,
  applyUrl?: string,
  remoteLabel?: string,
) => {
  const datePostedIso = toIsoDate(props["eui:datePosted"]);
  const validThroughIso = toIsoDate(props["eui:validThrough"]);
  const minSalary = toNumber(props["eui:salaryMin"]);
  const maxSalary = toNumber(props["eui:salaryMax"]);

  const hiringOrganization =
    props["eui:company"] || props["eui:companyUrl"]
      ? compactObject({
          "@type": "Organization",
          name: props["eui:company"],
          sameAs: props["eui:companyUrl"],
        })
      : undefined;

  const jobLocation =
    props["eui:jobLocation"] ||
    props["eui:addressLocality"] ||
    props["eui:country"] ||
    props["eui:postalCode"]
      ? compactObject({
          "@type": "Place",
          address: compactObject({
            "@type": "PostalAddress",
            streetAddress: props["eui:jobLocation"],
            addressLocality: props["eui:addressLocality"],
            addressRegion: props["eui:addressRegion"],
            postalCode: props["eui:postalCode"],
            addressCountry: props["eui:country"],
          }),
        })
      : undefined;

  const baseSalary =
    props["eui:salaryCurrency"] && (minSalary !== undefined || maxSalary !== undefined)
      ? compactObject({
          "@type": "MonetaryAmount",
          currency: props["eui:salaryCurrency"],
          value: compactObject({
            "@type": "QuantitativeValue",
            minValue: minSalary,
            maxValue: maxSalary,
            unitText: "YEAR",
          }),
        })
      : undefined;

  const schema = compactObject({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: props["jcr:title"],
    description: stripHtml(props["eui:description"] || props["eui:summary"]),
    datePosted: datePostedIso,
    validThrough: validThroughIso,
    employmentType: props["eui:employmentType"],
    jobLocationType: props["eui:workplaceType"],
    jobLocation,
    hiringOrganization,
    occupationalCategory: props["eui:department"],
    educationRequirements: props["eui:experienceLevel"],
    identifier:
      props["eui:jobId"] || props["eui:company"]
        ? compactObject({
            "@type": "PropertyValue",
            name: props["eui:company"],
            value: props["eui:jobId"],
          })
        : undefined,
    baseSalary,
    directApply: Boolean(applyUrl),
    applicantLocationRequirements:
      props["eui:workplaceType"] && props["eui:workplaceType"].toLowerCase().includes("remote")
        ? [
            compactObject({
              "@type": "Country",
              name: remoteLabel || "Remote",
            }),
          ]
        : undefined,
    industry: props["eui:department"],
    inLanguage: locale,
  });

  return JSON.stringify(schema);
};
