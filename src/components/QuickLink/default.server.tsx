import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
import type { ComponentType } from "react";
import {
  Calendar,
  FileText,
  Monitor,
  BookOpen,
  Umbrella,
  Wallet,
  type LucideProps,
} from "lucide-react";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { QuickLinkProps } from "./types.js";
import classes from "../QuickLinkList/component.module.css";

const ICONS: Record<string, ComponentType<LucideProps>> = {
  payslips: FileText,
  timeOff: Umbrella,
  itTickets: Monitor,
  learning: BookOpen,
  expenses: Wallet,
  events: Calendar,
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:quickLink",
    displayName: "Quick Link",
  },
  (props: QuickLinkProps) => {
    const {
      "jcr:title": title,
      "eui:icon": icon,
      "seu:linkType": linkType,
      "seu:linkTarget": linkTarget,
      "seu:externalLink": externalUrl,
      "seu:internalLink": internalLink,
    } = props;

    const rawHref = props["eui:url"];
    let href = rawHref || "";
    if (linkType === "externalLink" && externalUrl) {
      href = externalUrl;
    } else if (linkType === "internalLink" && internalLink) {
      href =
        typeof internalLink === "string"
          ? internalLink
          : buildNodeUrl(internalLink as JCRNodeWrapper);
    } else if (linkType === "self") {
      href = "#";
    } else if (!linkType && !href) {
      const legacyInternal = props["seu:internalLink"];
      const legacyExternal = props["seu:externalLink"];
      if (legacyInternal) {
        href =
          typeof legacyInternal === "string"
            ? legacyInternal
            : buildNodeUrl(legacyInternal as JCRNodeWrapper);
      } else if (legacyExternal) {
        href = legacyExternal;
      }
    }

    if (!title) return <></>;
    //if (!href) return <></>;

    const target = linkTarget && linkTarget !== "_self" ? linkTarget : undefined;
    const rel = target === "_blank" ? "noopener noreferrer" : undefined;

    const IconComponent = icon ? ICONS[icon] : undefined;

    return (
      <li className={classes.item}>
        <a className={classes.link} href={href} target={target} rel={rel} aria-label={title}>
          {IconComponent && (
            <IconComponent className={classes.icon} size={20} strokeWidth={1.8} aria-hidden="true" />
          )}
          <span className={classes.label}>{title}</span>
        </a>
      </li>
    );
  },
);
