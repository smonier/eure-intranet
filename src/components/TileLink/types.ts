import type { JCRNodeWrapper } from "org.jahia.services.content";

export type TileLinkProps = {
  node?: JCRNodeWrapper;
  "jcr:title": string;
  "eui:description"?: string;
  "eui:icon"?: string;
  "eui:url"?: string;
  "seu:linkType"?: string;
  "seu:linkTarget"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: JCRNodeWrapper | string;
  [key: string]: unknown;
};
