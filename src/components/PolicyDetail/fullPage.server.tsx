import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { Props } from "./types";
import classes from "./fullPage.module.css";
import type { RenderContext } from "org.jahia.services.render";

const formatEffectiveDate = (value?: string, locale = "en") => {
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

const extractLeadParagraph = (html?: string) => {
  if (!html) {
    return undefined;
  }
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
  if (!match) {
    return undefined;
  }
  const text = match[1]?.replace(/<[^>]+>/g, "").trim();
  return text || undefined;
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
    nodeType: "euint:policy",
    name: "fullPage",
    displayName: "Policy Detail - Full Page",
  },
  (rawProps: Props, { renderContext }: { renderContext: RenderContext }) => {
    const locale = resolveLocale(renderContext);
    const title = rawProps["jcr:title"];
    const description = rawProps["eui:description"];
    const effectiveDate = formatEffectiveDate(rawProps["eui:effectiveDate"], locale);
    const leadParagraph = extractLeadParagraph(description);

    return (
      <article>
        <section className={classes.hero}>
          <div className={classes.heroAccent} aria-hidden="true" />
          <div className={classes.heroInner}>
            <span className={classes.label}>{t("jempnt_policy.fullPage.label", "Company Policy")}</span>
            <h1 className={classes.title}>{title}</h1>
            {leadParagraph && <p className={classes.lead}>{leadParagraph}</p>}
            {effectiveDate && (
              <p className={classes.date}>
                <span className={classes.dateDot} aria-hidden="true" />
                {t("jemp.label.effective", "Effective")} {effectiveDate}
              </p>
            )}
          </div>
        </section>

        <div className={classes.contentShell}>
          <section
            className={classes.bodyWrapper}
            data-empty={description ? undefined : "true"}
          >
            {description ? (
              <div className={classes.body} dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              t("jempnt_policy.fullPage.empty", "Policy content will be published soon.")
            )}
          </section>

          <aside className={classes.sidebar}>
            <div className={classes.sidebarCard}>
              <h2 className={classes.sidebarTitle}>
                {t("jempnt_policy.fullPage.sidebarTitle", "Need-to-know details")}
              </h2>
              <dl className={classes.definitionList}>
                {effectiveDate && (
                  <div className={classes.definitionItem}>
                    <dt>{t("jemp.label.effective", "Effective")}</dt>
                    <dd>{effectiveDate}</dd>
                  </div>
                )}
                <div className={classes.definitionItem}>
                  <dt>{t("jempnt_policy.fullPage.owner", "Policy Owner")}</dt>
                  <dd>{t("jempnt_policy.fullPage.ownerValue", "People & Culture Team")}</dd>
                </div>
              </dl>
              <p className={classes.sidebarNote}>
                {t(
                  "jempnt_policy.fullPage.support",
                  "Have questions about this policy? Contact your HR partner for personalized guidance.",
                )}
              </p>
              <p className={classes.sidebarHelp}>
                {t(
                  "jempnt_policy.fullPage.help",
                  "Tip: Save this page for quick access to the latest updates.",
                )}
              </p>
            </div>
          </aside>
        </div>
      </article>
    );
  },
);
