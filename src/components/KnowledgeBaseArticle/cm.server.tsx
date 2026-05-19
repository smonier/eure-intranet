import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { Props } from "./types.js";
import classes from "./component.module.css";

const formatReviewedDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:kbArticle",
    name: "cm",
    displayName: "Knowledge Base Article - Content Manager Preview",
  },
  (rawProps) => {
    const props = rawProps as Props;
    const reviewed = formatReviewedDate(props["eui:lastReviewed"]);

    return (
      <article className={classes.article}>
        <h2 className={classes.title}>{props["jcr:title"]}</h2>
        {props["eui:problem"] && <p className={classes.problem}>{props["eui:problem"]}</p>}
        {(props["eui:platform"] || reviewed) && (
          <div className={classes.meta}>
            {props["eui:platform"] && (
              <span>
                {t("jemp.label.platform")}: {props["eui:platform"]}
              </span>
            )}
            {props["eui:platform"] && reviewed && " · "}
            {reviewed && (
              <span>
                {t("jemp.label.lastReviewed")}: {reviewed}
              </span>
            )}
          </div>
        )}
      </article>
    );
  },
);
