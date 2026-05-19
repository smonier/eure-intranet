import type { JCRNodeWrapper } from "org.jahia.services.content";

export type CafeteriaMenuItem = {
  id: string;
  title: string;
  menuDate?: string;
  isVegan?: boolean;
  allergens?: string[];
  dishes?: string;
  imageUrl?: string;
  calories?: string;
};

export type CafeteriaMenuProps = {
  node?: JCRNodeWrapper;
  "jcr:title"?: string;
  "eui:weekLabel"?: string;
  [key: string]: unknown;
};
