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

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:policy",
    name: "default",
    displayName: "Policy Detail",
  },
  (rawProps) => {
    const props = rawProps as Props;
    const effectiveDate = formatEffectiveDate(props["eui:effectiveDate"]);

    return (
      <article className={classes.policy}>
        <h2 className={classes.title}>{props["jcr:title"]}</h2>
        {effectiveDate && (
          <div className={classes.meta}>
            {t("jemp.label.effective")} {effectiveDate}
          </div>
        )}
        {props["eui:description"] && (
          <div
            className={classes.description}
            dangerouslySetInnerHTML={{ __html: props["eui:description"] }}
          />
        )}
      </article>
    );
  },
);
