import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import classes from "./fullPage.module.css";
import type { Props } from "./types";
import type { RenderContext } from "org.jahia.services.render";

const formatDate = (value?: string, locale = "en") => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const resolveLocale = (renderContext: RenderContext) => {
  const contextWithLocale = renderContext as unknown as {
    getUILocale?: () => unknown;
    getLocale?: () => unknown;
  };

  const localeCandidate =
    typeof contextWithLocale.getUILocale === "function"
      ? contextWithLocale.getUILocale()
      : typeof contextWithLocale.getLocale === "function"
        ? contextWithLocale.getLocale()
        : null;

  return localeCandidate && typeof (localeCandidate as { toString?: () => string }).toString === "function"
    ? (localeCandidate as { toString: () => string }).toString()
    : "en";
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:kbArticle",
    name: "fullPage",
    displayName: "Knowledge Base Article (Full)",
  },
  (rawProps: Props, { renderContext }: { renderContext: RenderContext }) => {
    const locale = resolveLocale(renderContext);
    const props = rawProps;

    const title = props["jcr:title"];
    const problem = props["eui:problem"];
    const platform = props["eui:platform"];
    const lastReviewed = formatDate(props["eui:lastReviewed"], locale);
    const steps = props["eui:steps"];

    const metaEntries = [
      platform && {
        label: t("jemp.label.platform", "Platform"),
        value: platform,
      },
      lastReviewed && {
        label: t("jemp.label.lastReviewed", "Last reviewed"),
        value: lastReviewed,
      },
    ].filter((entry): entry is { label: string; value: string } => Boolean(entry && entry.value));

    return (
      <article>
        <section className={classes.hero}>
          <div className={classes.heroContent}>
            <span className={classes.heroEyebrow}>{t("kb.title", "Knowledge Base")}</span>
            <h1 className={classes.heroTitle}>{title}</h1>
            {problem && <p className={classes.heroSubtitle}>{problem}</p>}
            {metaEntries.length > 0 && (
              <div className={classes.chipRow}>
                {metaEntries.map((entry) => (
                  <span key={entry.label} className={classes.chip}>
                    {entry.label}: {entry.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={classes.page}>
          <div className={classes.layout}>
            <div className={classes.panel}>
              <h2 className={classes.panelTitle}>{t("kb.section.steps", "Resolution steps")}</h2>
              {steps ? (
                <div className={classes.steps} dangerouslySetInnerHTML={{ __html: steps }} />
              ) : (
                <div className={classes.emptyState}>{t("kb.section.empty", "No resolution steps provided yet.")}</div>
              )}
            </div>

            {metaEntries.length > 0 && (
              <aside className={classes.panel}>
                <div className={classes.infoBlock}>
                  <h3 className={classes.infoTitle}>{t("kb.section.summary", "Article info")}</h3>
                  <ul className={classes.infoList}>
                    {metaEntries.map((entry) => (
                      <li key={entry.label} className={classes.infoItem}>
                        <span className={classes.infoLabel}>{entry.label}</span>
                        <span className={classes.infoValue}>{entry.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </section>
      </article>
    );
  },
);
