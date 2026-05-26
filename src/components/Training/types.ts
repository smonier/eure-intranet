import type { JCRNodeWrapper } from "org.jahia.services.content";

export type TrainingProps = {
  node?: JCRNodeWrapper;
  "jcr:title": string;
  "eui:summary"?: string;
  "eui:description"?: string;
  "eui:startDate"?: string;
  "eui:endDate"?: string;
  "eui:duration"?: string;
  "eui:deliveryMode"?: string;
  "eui:location"?: string;
  "eui:providerName"?: string;
  "eui:providerUrl"?: string;
  "eui:skillLevel"?: string;
  "eui:audience"?: string;
  "eui:format"?: string;
  "eui:cost"?: string;
  "eui:heroImage"?: JCRNodeWrapper | string | null;
  "seu:linkType"?: string;
  "seu:linkTarget"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: JCRNodeWrapper | string | null;
  "j:tagList"?: string[];
  "j:defaultCategory"?: JCRNodeWrapper[];
  [key: string]: unknown;
};

export type TrainingCardProps = TrainingProps & {
  currentNode?: JCRNodeWrapper;
};
