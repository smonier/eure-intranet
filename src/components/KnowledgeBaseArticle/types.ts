import type { JCRNodeWrapper } from "org.jahia.services.content";

export type Props = {
  "jcr:title": string;
  "eui:problem"?: string;
  "eui:steps"?: string;
  "eui:platform"?: string;
  "eui:lastReviewed"?: string;
  "j:tagList"?: string[];
  "j:defaultCategory"?: JCRNodeWrapper[];
};
