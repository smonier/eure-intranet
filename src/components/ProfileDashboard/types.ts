export type ProfileId = "terrain" | "rh" | "com" | "encadrant";

export interface ProfileDashboardProps {
  "jcr:title"?: string;
  "eui:subtitle"?: string;
  "eui:defaultProfile"?: ProfileId;
  "eui:showPersonaSwitcher"?: boolean;
}

export interface Persona {
  id: ProfileId;
  name: string;
  role: string;
  direction: string;
  initials: string;
  color: string;
}
