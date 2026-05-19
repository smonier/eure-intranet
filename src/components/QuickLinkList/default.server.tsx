import { jahiaComponent, RenderChildren } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import classes from "./component.module.css";
import type { Props } from "./types.js";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:quickLinkList",
    displayName: "Quick Link List",
  },
  (props: Props) => {
    const title = props["jcr:title"];
    const defaultLabel = t("jemp.label.quickLinks");
    const headingText = title || defaultLabel;
    const ariaLabel = headingText;

    return (
      <nav className={classes.quicklinks} aria-label={ariaLabel}>
        {headingText && <h2 className={classes.heading}>{headingText}</h2>}
        <ul className={classes.grid}>
          <RenderChildren />
        </ul>
      </nav>
    );
  },
);
