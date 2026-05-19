import { jahiaComponent, getNodeProps } from "@jahia/javascript-modules-library";
import type { Resource } from "org.jahia.services.render";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import { t } from "i18next";
import classes from "./component.module.css";
import {
  normaliseLocaleCode,
  resolveImageUrl,
  sanitiseRichText,
  formatMenuDateLabel,
  normaliseMenuDate,
  resolveLocalizedString,
  resolveLocalizedStringList,
} from "../CafeteriaMenu/utils";

type Props = {
  "jcr:title"?: string;
  "eui:menuDate"?: string;
  "eui:isVegan"?: string | boolean;
  "eui:allergens"?: string | string[];
  "eui:dishes"?: string;
  "eui:calories"?: string;
  "eui:image"?: unknown;
};

const toBoolean = (value?: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
};

const resolveAllergens = (value: unknown, locale: string) =>
  resolveLocalizedStringList(value, locale);

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:cafeteriaMenuItem",
    name: "fullPage",
    displayName: "Cafeteria Menu Item - Full Page",
  },
  (
    rawProps: Props,
    {
      currentNode,
      currentResource,
    }: {
      currentNode?: JCRNodeWrapper;
      currentResource: Resource;
    },
  ) => {
    const node = (currentNode ||
      (rawProps as unknown as { node?: JCRNodeWrapper }).node) as JCRNodeWrapper | undefined;

    const props = node
      ? getNodeProps<Props>(node, [
          "jcr:title",
          "eui:menuDate",
          "eui:isVegan",
          "eui:allergens",
          "eui:dishes",
          "eui:calories",
          "eui:image",
        ])
      : rawProps;

    const locale = normaliseLocaleCode(currentResource.getLocale().getLanguage()) ?? "en";
    const title = resolveLocalizedString(props["jcr:title"], locale) || props["jcr:title"];
    const rawDate = normaliseMenuDate(props["eui:menuDate"]);
    const dateLabel = formatMenuDateLabel(rawDate, locale);
    const isVegan = toBoolean(props["eui:isVegan"]);
    const allergens = resolveAllergens(props["eui:allergens"], locale);
    const descriptionSource = resolveLocalizedString(props["eui:dishes"], locale);
    const description = sanitiseRichText(descriptionSource);
    const calories = resolveLocalizedString(props["eui:calories"], locale) || props["eui:calories"];
    const imageUrl = resolveImageUrl(props["eui:image"]);

    return (
      <article className={classes.fullPage}>
        <header className={classes.hero}>
          {imageUrl && <img src={imageUrl} alt={title ?? ""} />}
          <div className={classes.heroOverlay}>
            <div className={classes.heroContent}>
              <div className={`${classes.badgeRow} ${classes.badgeRowCenter}`}>
                {dateLabel && <span className={classes.badge}>{dateLabel}</span>}
                {calories && <span className={classes.badge}>{calories}</span>}
                {isVegan && (
                  <span className={`${classes.badge} ${classes.badgeVegan}`}>
                    {t("cafeteriaMenu.vegan", "Vegan")}
                  </span>
                )}
              </div>
              <h1 className={classes.heroTitle}>{title}</h1>
            </div>
          </div>
        </header>

        <div className={classes.bodyShell}>
          {description && (
            <div className={classes.body} dangerouslySetInnerHTML={{ __html: description }} />
          )}
          {allergens && allergens.length > 0 && (
            <div className={classes.allergens}>
              <h2>{t("cafeteriaMenuItem.allergens", "Allergens")}</h2>
              <div className={classes.chips}>
                {allergens.map((allergen) => (
                  <span key={allergen} className={classes.chip}>
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  },
);
