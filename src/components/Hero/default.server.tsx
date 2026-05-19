import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
import type { CSSProperties } from "react";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { RenderContext } from "org.jahia.services.render";
import type { HeroProps } from "./types.js";
import classes from "./component.module.css";

const resolveImageUrl = (
  image: HeroProps["eui:backgroundImage"],
  renderContext?: RenderContext,
) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (typeof image === "object" && "getPath" in image && typeof image.getPath === "function") {
    const path = (image as JCRNodeWrapper).getPath();
    const mode =
      typeof renderContext?.getMode === "function"
        ? renderContext.getMode()
        : renderContext?.isEditMode?.()
          ? "edit"
          : "live";
    const segment = mode === "live" ? "live" : "default";
    return `/files/${segment}${path}`;
  }
  return null;
};

const resolveLink = (props: HeroProps) => {
  const directUrl = typeof props["eui:url"] === "string" ? props["eui:url"] : null;
  const { "seu:linkType": linkType, "seu:externalLink": external, "seu:internalLink": internal } = props;

  if (linkType === "externalLink" && typeof external === "string") {
    return external;
  }

  if (linkType === "internalLink" && internal) {
    if (typeof internal === "string") {
      return internal;
    }
    if (typeof internal === "object" && "getPath" in internal && typeof internal.getPath === "function") {
      return buildNodeUrl(internal as JCRNodeWrapper);
    }
  }

  const legacyInternal = props["seu:internalLink"];
  if (!linkType && legacyInternal) {
    if (typeof legacyInternal === "string") {
      return legacyInternal;
    }
    if (typeof legacyInternal === "object" && "getPath" in legacyInternal) {
      return buildNodeUrl(legacyInternal as JCRNodeWrapper);
    }
  }

  const legacyExternal = props["seu:externalLink"];
  if (!linkType && typeof legacyExternal === "string") {
    return legacyExternal;
  }

  return directUrl;
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:hero",
    name: "default",
    displayName: "Hero Banner",
  },
  (props: HeroProps, { renderContext }: { renderContext: RenderContext }) => {
    const title = props["jcr:title"];
    const subtitle = props["eui:subtitle"];
    const ctaLabelRaw = typeof props["eui:ctaLabel"] === "string" ? props["eui:ctaLabel"].trim() : "";
    const hasCtaLabel = Boolean(ctaLabelRaw);
    const backgroundUrl = resolveImageUrl(props["eui:backgroundImage"], renderContext);
    const href = resolveLink(props);
    const hasLink = Boolean(href);
    const linkTarget =
      props["seu:linkTarget"] && props["seu:linkTarget"] !== "_self"
        ? props["seu:linkTarget"]
        : undefined;
    const rel = linkTarget === "_blank" ? "noopener noreferrer" : undefined;

    const style: CSSProperties | undefined = backgroundUrl
      ? {
          backgroundImage: `url(${backgroundUrl})`,
        }
      : undefined;

    return (
      <section className={classes.root} style={style}>
        <div className={classes.content}>
          <span className={classes.eyebrow}>
            <span aria-hidden="true" />
          </span>
          <h2 className={classes.title}>{title}</h2>
          {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
          {hasCtaLabel && (
            <div className={classes.ctaRow}>
              {hasLink ? (
                <a className={classes.cta} href={href ?? "#"} target={linkTarget} rel={rel}>
                  {ctaLabelRaw}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <span className={classes.ctaStatic}>{ctaLabelRaw}</span>
              )}
            </div>
          )}
        </div>
      </section>
    );
  },
);
