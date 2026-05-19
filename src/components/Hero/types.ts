import type { JCRNodeWrapper } from "org.jahia.services.content";

export type HeroProps = {
  "jcr:title": string;
  "eui:subtitle"?: string;
  "eui:ctaLabel"?: string;
  "eui:backgroundImage"?: JCRNodeWrapper | string | null;
  "seu:linkType"?: string;
  "seu:linkTarget"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: JCRNodeWrapper | string | null;
  [key: string]: unknown;
};
