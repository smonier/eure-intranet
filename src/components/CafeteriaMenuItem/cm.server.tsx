import { getNodeProps, jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import classes from "./component.module.css";

const field = (labelKey: string, fallback: string, value?: string | null) =>
  value ? (
    <div className={classes.chip}>
      <strong>{t(labelKey, fallback)}: </strong>
      {value}
    </div>
  ) : null;

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:cafeteriaMenuItem",
    name: "cm",
    displayName: "Cafeteria Menu Item (Content Editor)",
  },
  ({}, { currentNode }: { currentNode: JCRNodeWrapper }) => {
    const props = getNodeProps<{
      "jcr:title"?: string;
      "eui:menuDate"?: string;
      "eui:isVegan"?: string;
      "eui:allergens"?: string;
    }>(currentNode, ["jcr:title", "eui:menuDate", "eui:isVegan", "eui:allergens"]);

    return (
      <div className={classes.content}>
        <h3 className={classes.title}>{props["jcr:title"]}</h3>
        <div className={classes.chips}>
          {field("cafeteriaMenuItem.cm.date", "Date", props["eui:menuDate"])}
          {field("cafeteriaMenuItem.cm.vegan", "Vegan", props["eui:isVegan"])}
          {field("cafeteriaMenuItem.cm.allergens", "Allergens", props["eui:allergens"])}
        </div>
      </div>
    );
  },
);
