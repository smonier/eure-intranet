import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
import classes from "./card.module.css";
import type { TrainingProps } from "./types";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import { formatDateTime, resolveImageUrl, resolveLocale } from "./utils";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import { resolveLink } from "~/utils/linkTo";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:training",
    name: "card",
    displayName: "Training Card",
  },
  (rawProps: TrainingProps, { renderContext, currentNode }) => {
    const locale = resolveLocale(renderContext as RenderContext);
    const props = rawProps;

    const title = props["jcr:title"];
    const summary = props["eui:summary"];
    const provider = props["eui:providerName"];
    const registrationLink = resolveLink(props, props["eui:providerUrl"]);
    const ctaUrl = registrationLink.href;
    const detailUrl =
      (currentNode as JCRNodeWrapper | undefined)?.getPath instanceof Function
        ? buildNodeUrl(currentNode as JCRNodeWrapper)
        : ctaUrl;
    const imageUrl = resolveImageUrl(props["eui:heroImage"], renderContext as RenderContext);
    const start = formatDateTime(props["eui:startDate"], locale);
    const delivery = props["eui:deliveryMode"];
    const location = props["eui:location"];
    const viewDetailsLabel = t("training.cta.viewDetails", "View details");

    const content = (
      <>
        {imageUrl && (
          <div className={classes.imageWrapper}>
            <img src={imageUrl} alt="" loading="lazy" />
          </div>
        )}
        <div className={classes.body}>
          <h3 className={classes.title}>{title}</h3>
          <div className={classes.meta}>
            {start && <span>{start}</span>}
            {delivery && <span>{delivery}</span>}
            {location && <span>{location}</span>}
            {!location && provider && <span>{provider}</span>}
          </div>
          {summary && <p className={classes.summary}>{summary}</p>}
          <div className={classes.ctaRow}>
            <span>{provider}</span>
            <span className={classes.viewMore}>
              {viewDetailsLabel} →
            </span>
          </div>
        </div>
      </>
    );

    const isDirectRegistrationLink = Boolean(detailUrl && ctaUrl && detailUrl === ctaUrl);
    const anchorTarget = isDirectRegistrationLink
      ? registrationLink.target ?? "_blank"
      : "_self";
    const anchorRel =
      (isDirectRegistrationLink ? registrationLink.rel : undefined) ??
      (anchorTarget === "_blank" ? "noopener noreferrer" : undefined);

    return (
      <article className={classes.card} itemScope itemType="https://schema.org/TrainingEvent">
        {detailUrl ? (
          <a
            className={classes.link}
            href={detailUrl}
            target={anchorTarget}
            rel={anchorRel}
          >
            {content}
          </a>
        ) : (
          <div className={classes.link}>{content}</div>
        )}
        {detailUrl && <meta itemProp="url" content={detailUrl} />}
        {imageUrl && <meta itemProp="image" content={imageUrl} />}
      </article>
    );
  },
);
