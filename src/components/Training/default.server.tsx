import { jahiaComponent } from "@jahia/javascript-modules-library";
import classes from "./component.module.css";
import type { TrainingProps } from "./types";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import { buildJsonLd, formatDateTime, resolveImageUrl, resolveLocale } from "./utils";
import { resolveLink } from "~/utils/linkTo";

const metaEntries = (
  props: TrainingProps,
  locale: string,
): Array<{ label: string; value?: string }> => {
  const start = formatDateTime(props["eui:startDate"], locale);
  const end = formatDateTime(props["eui:endDate"], locale);

  return [
    { label: t("training.meta.start", "Starts"), value: start },
    { label: t("training.meta.end", "Ends"), value: end },
    { label: t("training.meta.duration", "Duration"), value: props["eui:duration"] },
    { label: t("training.meta.delivery", "Delivery mode"), value: props["eui:deliveryMode"] },
    { label: t("training.meta.location", "Location"), value: props["eui:location"] },
    { label: t("training.meta.skillLevel", "Skill level"), value: props["eui:skillLevel"] },
    { label: t("training.meta.audience", "Audience"), value: props["eui:audience"] },
    { label: t("training.meta.format", "Format"), value: props["eui:format"] },
    { label: t("training.meta.cost", "Cost"), value: props["eui:cost"] },
  ].filter((entry) => entry.value);
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:training",
    name: "default",
    displayName: "Training",
  },
  (rawProps: TrainingProps, { renderContext }) => {
    const locale = resolveLocale(renderContext as RenderContext);
    const props = rawProps;

    const title = props["jcr:title"];
    const summary = props["eui:summary"];
    const description = props["eui:description"];
    const providerName = props["eui:providerName"];
    const providerUrl = props["eui:providerUrl"];
    const registrationLink = resolveLink(props, providerUrl);
    const ctaUrl = registrationLink.href;
    const ctaTarget = registrationLink.target ?? "_self";
    const ctaRel = registrationLink.rel ?? (ctaTarget === "_blank" ? "noopener noreferrer" : undefined);
    const imageUrl = resolveImageUrl(props["eui:heroImage"], renderContext as RenderContext);
    const meta = metaEntries(props, locale);
    const jsonLd = buildJsonLd(props, locale, ctaUrl, imageUrl);
    const hasProvider = providerName || providerUrl;
    const registerLabel = t("training.cta.register", "Register now");

    return (
      <article className={classes.root} itemScope itemType="https://schema.org/TrainingEvent">
        <header className={classes.header}>
          <div className={classes.metaBar}>
            <span className={classes.chip}>{t("training.label", "Training")}</span>
            {props["eui:format"] && <span className={classes.chip}>{props["eui:format"]}</span>}
          </div>
          <h2 className={classes.title} itemProp="name">
            {title}
          </h2>
          {summary && (
            <p className={classes.summary} itemProp="description">
              {summary}
            </p>
          )}
        </header>

        {meta.length > 0 && (
          <div className={classes.metaGrid}>
            {meta.map((entry) => (
              <div className={classes.metaItem} key={entry.label}>
                <span className={classes.metaLabel}>{entry.label}</span>
                <span className={classes.metaValue}>{entry.value}</span>
              </div>
            ))}
          </div>
        )}

        {description && (
          <div
            className={classes.description}
            dangerouslySetInnerHTML={{ __html: description }}
            itemProp="description"
          />
        )}

        <div className={classes.ctaRow}>
          {ctaUrl && (
            <a className={classes.cta} href={ctaUrl} target={ctaTarget} rel={ctaRel}>
              {registerLabel}
            </a>
          )}
          {hasProvider && (
            <span className={classes.metaLabel}>
              {t("training.meta.provider", "Provided by")}{" "}
              {providerUrl ? (
                <a href={providerUrl} className={classes.providerLink} target="_blank" rel="noopener noreferrer">
                  {providerName || providerUrl}
                </a>
              ) : (
                <span className={classes.metaValue}>{providerName}</span>
              )}
            </span>
          )}
        </div>

        <script
          type="application/ld+json"
          className={classes.schemaScript}
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />

        {imageUrl && <meta itemProp="image" content={imageUrl} />}
        {ctaUrl && <meta itemProp="url" content={ctaUrl} />}
      </article>
    );
  },
);
