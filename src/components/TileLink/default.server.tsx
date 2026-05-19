import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
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
  type LucideProps,
} from "lucide-react";
import type { TileLinkProps } from "./types";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import classes from "./component.module.css";
import { t } from "i18next";

const ICONS: Record<string, ComponentType<LucideProps>> = {
  calendar: Calendar,
  news: FileText,
  it: Monitor,
  learning: BookOpen,
  career: Briefcase,
  people: Users,
  ideas: Lightbulb,
  explore: Compass,
};

const resolveHref = (props: TileLinkProps) => {
  const {
    "seu:linkType": linkType,
    "seu:externalLink": externalLink,
    "seu:internalLink": internalLink,
  } = props;
  let href = props["eui:url"] || "";

  if (linkType === "externalLink" && externalLink) {
    href = externalLink;
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

  return href;
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:tileLink",
    name: "default",
    displayName: "Tile Link",
  },
  (props: TileLinkProps) => {
    const {
      "jcr:title": title,
      "eui:description": description,
      "eui:icon": iconKey,
      "seu:linkTarget": linkTarget,
    } = props;

    if (!title) {
      return <></>;
    }

    const href = resolveHref(props);
    const hasLink = Boolean(href);
    const target = linkTarget && linkTarget !== "_self" ? linkTarget : undefined;
    const rel = target === "_blank" ? "noopener noreferrer" : undefined;

    const IconComponent = iconKey ? ICONS[iconKey] : undefined;

    const tileContent = (
      <div className={classes.content}>
        <div className={classes.iconWrapper} aria-hidden="true">
          {IconComponent ? (
            <IconComponent size={24} strokeWidth={1.8} />
          ) : (
            <span>{title.charAt(0)}</span>
          )}
        </div>
        <h3 className={classes.title}>{title}</h3>
        {description && <p className={classes.description}>{description}</p>}
        {hasLink && <span className={classes.meta}>{t("tileLink.cta.view", "View details")} →</span>}
      </div>
    );

    if (!hasLink) {
      return <article className={classes.tile}>{tileContent}</article>;
    }

    return (
      <article className={classes.tile}>
        <a
          className={classes.link}
          href={href}
          target={target}
          rel={rel}
          aria-label={title}
        />
        {tileContent}
      </article>
    );
  },
);
