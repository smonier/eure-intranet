import type { JCRNodeWrapper } from "org.jahia.services.content";

export type Props = {
  "jcr:title": string;
  "eui:summary"?: string;
  "eui:start"?: string;
  "eui:end"?: string;
  "eui:location"?: string;
  "eui:requiresRSVP"?: boolean;
  "seu:linkType"?: string;
  "seu:linkTarget"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: JCRNodeWrapper | string | null;
};
