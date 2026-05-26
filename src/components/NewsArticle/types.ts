import type { JCRNodeWrapper } from "org.jahia.services.content";

export type NewsNode = JCRNodeWrapper & {
  "jcr:title": string;
  "eui:summary"?: string;
  "eui:body"?: string;
  "eui:heroImage"?: JCRNodeWrapper;
  "eui:publishDate"?: string;
  "j:tagList"?: string[];
  "j:defaultCategory"?: JCRNodeWrapper[];
  "eui:profiles"?: string[];
  "eui:direction"?: string;
};

export type Props = NewsNode;
