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

const resolveVegan = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:cafeteriaMenuItem",
    name: "card",
    displayName: "Cafeteria Menu Item Card",
  },
  (
    rawProps: Props,
    {
      currentNode,
      currentResource,
    }: { currentNode?: JCRNodeWrapper; currentResource: Resource },
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

    const locale =
      normaliseLocaleCode(currentResource.getLocale().getLanguage()) ?? "en";

    const title = resolveLocalizedString(props["jcr:title"], locale) || props["jcr:title"];
    const normalisedDate = normaliseMenuDate(props["eui:menuDate"]);
    const menuDate = formatMenuDateLabel(normalisedDate, locale);
    const isVegan = resolveVegan(props["eui:isVegan"]);
    const allergens = resolveLocalizedStringList(props["eui:allergens"], locale);
    const description = resolveLocalizedString(props["eui:dishes"], locale);
    const calories = resolveLocalizedString(props["eui:calories"], locale) || props["eui:calories"];
    const imageUrl = resolveImageUrl(props["eui:image"]);

    return (
      <article className={classes.card} itemScope itemType="https://schema.org/MenuItem">
        {imageUrl && (
          <div className={classes.imageWrapper}>
            <img src={imageUrl} alt="" loading="lazy" />
          </div>
        )}
        <div className={classes.content}>
          <div className={classes.titleRow}>
            <h3 className={classes.title} itemProp="name">
              {title}
            </h3>
          </div>
          <div className={classes.chips}>
            {menuDate && <span className={classes.chip}>{menuDate}</span>}
            {isVegan && <span className={`${classes.chip} ${classes.vegan}`}>{t("cafeteriaMenu.vegan", "Vegan")}</span>}
            {calories && <span className={classes.chip}>{calories}</span>}
          </div>
          {description && (
            <div
              className={classes.body}
              itemProp="description"
              dangerouslySetInnerHTML={{ __html: sanitiseRichText(description) ?? "" }}
            />
          )}
          {allergens && allergens.length > 0 && (
            <div className={classes.chips}>
              {allergens.map((allergen) => (
                <span key={allergen} className={classes.chip}>
                  {allergen}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    );
  },
);
