export type FileType = "pdf" | "docx" | "xlsx" | "pptx" | "zip" | "other";
export type DocSource = "local" | "sharepoint" | "ged";

export interface DocumentCardProps {
  "jcr:title": string;
  "eui:description"?: string;
  "eui:fileType"?: FileType;
  "eui:source"?: DocSource;
  "eui:direction"?: string;
  "eui:publishedDate"?: string;
  "seu:linkType"?: string;
  "seu:externalLink"?: string;
  "seu:internalLink"?: unknown;
  "seu:linkTarget"?: string;
}

export interface DocumentListProps {
  "jcr:title"?: string;
  "eui:showSourceBadge"?: boolean;
}
