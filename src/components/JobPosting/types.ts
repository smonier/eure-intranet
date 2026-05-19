import type { JCRNodeWrapper } from "org.jahia.services.content";

export type JobPostingNode = JCRNodeWrapper & {
  "jcr:title": string;
  "eui:subtitle"?: string;
  "eui:summary"?: string;
  "eui:description"?: string;
  "eui:department"?: string;
  "eui:employmentType"?: string;
  "eui:workplaceType"?: string;
  "eui:experienceLevel"?: string;
  "eui:jobLocation"?: string;
  "eui:addressLocality"?: string;
  "eui:addressRegion"?: string;
  "eui:postalCode"?: string;
  "eui:country"?: string;
  "eui:salaryRange"?: string;
  "eui:salaryCurrency"?: string;
  "eui:salaryMin"?: string;
  "eui:salaryMax"?: string;
  "eui:applyUrl"?: string;
  "eui:datePosted"?: string;
  "eui:validThrough"?: string;
  "eui:company"?: string;
  "eui:companyUrl"?: string;
  "eui:jobId"?: string;
  "seu:linkType"?: string;
  "seu:linkTarget"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: JCRNodeWrapper | string | null;
};

export type JobPostingProps = JobPostingNode;
