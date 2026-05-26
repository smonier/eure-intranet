import { jahiaComponent } from "@jahia/javascript-modules-library";
import type { ComponentType } from "react";
import {
  Calendar,
  FileText,
  Monitor,
  BookOpen,
  Briefcase,
  Users,
  Lightbulb,
  Compass,
  Clock,
  MapPin,
  FolderOpen,
  Phone,
  Building,
  GraduationCap,
  BarChart2,
  Mail,
  Shield,
  Wrench,
  CreditCard,
  TreePine,
  ClipboardList,
  Banknote,
  HeartPulse,
  Search,
  Settings,
  Home,
  type LucideProps,
} from "lucide-react";
import type { Props } from "./types.js";
import classes from "./component.module.css";

const ICONS: Record<string, ComponentType<LucideProps>> = {
  badgeuse: Clock,
  absences: ClipboardList,
  conges: TreePine,
  planning: Calendar,
  annuaire: Phone,
  salles: Building,
  messagerie: Mail,
  formation: GraduationCap,
  ged: FolderOpen,
  organigramme: BarChart2,
  frais: CreditCard,
  paie: Banknote,
  dsi: Wrench,
  securite: Shield,
  sante: HeartPulse,
  calendar: Calendar,
  news: FileText,
  it: Monitor,
  learning: BookOpen,
  career: Briefcase,
  people: Users,
  ideas: Lightbulb,
  explore: Compass,
  accueil: Home,
  agents: Users,
  voirie: MapPin,
  recherche: Search,
  parametres: Settings,
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:dashboardCard",
    displayName: "Dashboard Card",
  },
  (props: Props) => {
    const title = props["jcr:title"];
    const type = props["eui:type"] ?? "info";
    const deeplink = props["eui:deeplink"];
    const value = props["eui:value"];
    const iconKey = props["eui:icon"];

    if (!title) return <></> ;

    const IconComponent = iconKey ? ICONS[iconKey] : undefined;

    const cardClass = [classes.card, classes[`card--${type}`]]
      .filter(Boolean)
      .join(" ");

    const inner = (
      <>
        <div className={classes.cardIcon} aria-hidden="true">
          {IconComponent ? (
            <IconComponent size={22} strokeWidth={1.8} />
          ) : (
            <span>{title.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className={classes.cardContent}>
          <h3 className={classes.cardTitle}>{title}</h3>
          {value && (
            <div className={classes.cardValue} aria-label={`${title}: ${value}`}>
              {value}
            </div>
          )}
        </div>
      </>
    );

    if (deeplink) {
      return (
        <a href={deeplink} className={cardClass}>
          {inner}
        </a>
      );
    }

    return <div className={cardClass}>{inner}</div>;
  },
);
