import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
import classes from "./card.module.css";
import type { Props } from "./types";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import { t } from "i18next";

const formatDate = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:kbArticle",
    name: "card",
    displayName: "Knowledge Base Article Card",
  },
  (rawProps: Props, { currentNode }) => {
    const node = currentNode as JCRNodeWrapper;
    const title = rawProps["jcr:title"];
    const problem = rawProps["eui:problem"];
    const platform = rawProps["eui:platform"];
    const lastReviewed = formatDate(rawProps["eui:lastReviewed"]);
    const href = buildNodeUrl(node);

    return (
      <a className={classes.card} href={href} aria-label={title}>
        <h3 className={classes.title}>{title}</h3>
        {problem && <p className={classes.problem}>{problem}</p>}
        <div className={classes.meta}>
          {platform && <span className={classes.badge}>{platform}</span>}
          {lastReviewed && (
            <span className={classes.badge}>
              {t("jemp.label.lastReviewed", "Last reviewed")}: {lastReviewed}
            </span>
          )}
        </div>
      </a>
    );
  },
);
