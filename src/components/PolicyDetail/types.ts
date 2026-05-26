import type { JCRNodeWrapper } from "org.jahia.services.content";

export type Props = {
  "jcr:title": string;
  "eui:description"?: string;
  "eui:effectiveDate"?: string;
  "j:templateName"?: string;
  "jcr:uuid"?: string;
  "j:tagList"?: string[];
  "j:defaultCategory"?: JCRNodeWrapper[];
  [key: string]: unknown;
};
