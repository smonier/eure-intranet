import { jahiaComponent, Render } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import classes from "./component.module.css";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:cafeteriaMenu",
    name: "cm",
    displayName: "Cafeteria Menu (Content Editor)",
  },
  ({}, { currentNode }: { currentNode?: JCRNodeWrapper }) => {
    if (!currentNode) {
      return <div className={classes.menuContainer} />;
    }

    return (
      <div className={classes.grid}>
        <Render node={currentNode} view="default" readOnly />
      </div>
    );
  },
);
