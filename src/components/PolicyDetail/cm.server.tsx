import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { Props } from "./types.js";
import classes from "./component.module.css";

const formatEffectiveDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
};

const CardView = (props: Props) => {
  const effectiveDate = formatEffectiveDate(props["eui:effectiveDate"]);
  const description = props["eui:description"];
  const firstParagraphMatch = description?.match(/<p[^>]*>(.*?)<\/p>/i);
  const firstParagraph = firstParagraphMatch ? firstParagraphMatch[0] : undefined;

  return (
    <article className={classes.policyCard}>
      <div className={classes.policyCardContent}>
        <h3 className={classes.policyCardTitle}>{props["jcr:title"]}</h3>
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
        <span className={classes.policyCardLink}>{t("jemp.label.viewDetails")}</span>
      </div>
    </article>
  );
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:policy",
    name: "cm",
    displayName: "Policy - Content Manager Preview",
  },
  (rawProps) => {
    const props = rawProps as Props;
    return <CardView {...props} />;
  },
);
