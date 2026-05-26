/** Props for euint:dashboardCard — individual card node */
export interface Props {
  "jcr:title"?: string;
  "eui:type"?: "info" | "stat" | "task" | "link";
  "eui:deeplink"?: string;
  "eui:value"?: string;
  "eui:icon"?: string;
}

/** Props for euint:myCards — container node */
export interface MyCardsProps {
  "jcr:title"?: string;
}
