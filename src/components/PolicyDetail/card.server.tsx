import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import { t } from "i18next";
import type { Props } from "./types.js";
import classes from "./component.module.css";

const formatEffectiveDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:policy",
    name: "card",
    displayName: "Policy Card",
    priority: 5,
  },
  (rawProps, { currentNode }) => {
    const props = rawProps as Props;
    const effectiveDate = formatEffectiveDate(props["eui:effectiveDate"]);
    const title = props["jcr:title"];
    const description = props["eui:description"];
    const node = currentNode as JCRNodeWrapper;

    const firstParagraphMatch = description?.match(/<p[^>]*>(.*?)<\/p>/i);
    const firstParagraph = firstParagraphMatch ? firstParagraphMatch[0] : undefined;

    return (
      <article className={classes.policyCard}>
        <div className={classes.policyCardContent}>
          <h3 className={classes.policyCardTitle}>{title}</h3>
          {effectiveDate && (
            <div className={classes.policyCardMeta}>
              <span className={classes.policyCardLabel}>{t("jemp.label.effective")}</span>
              <span className={classes.policyCardValue}>{effectiveDate}</span>
            </div>
          )}
          {firstParagraph && (
            <div
              className={classes.policyCardExcerpt}
              dangerouslySetInnerHTML={{ __html: firstParagraph }}
            />
          )}
        </div>
        <div className={classes.policyCardActions}>
          <a className={classes.policyCardLink} href={buildNodeUrl(node)}>
            {t("jemp.label.readMore")}
          </a>
        </div>
      </article>
    );
  },
);
