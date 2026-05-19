import { Area, jahiaComponent } from "@jahia/javascript-modules-library";
import type { RenderContext } from "org.jahia.services.render";
import type { TwoColumnRowProps } from "./types";
import classes from "./component.module.css";

jahiaComponent(
  {
    nodeType: "euint:twoColumnRow",
    name: "default",
    displayName: "Two Column Row",
  },
  ({ leftColumnTitle, rightColumnTitle }: TwoColumnRowProps, { renderContext }: { renderContext: RenderContext }) => {
    const isEditMode = renderContext.isEditMode();

    return (
      <div className={classes.twoColumnRow}>
        <div className={classes.column}>
          {leftColumnTitle && <h2 className={classes.columnTitle}>{leftColumnTitle}</h2>}
          <div className={`${classes.columnContent} ${isEditMode ? classes.editMode : ""}`}>
            <Area name="leftColumn" nodeType="jnt:contentList" />
          </div>
        </div>
        <div className={classes.column}>
          {rightColumnTitle && <h2 className={classes.columnTitle}>{rightColumnTitle}</h2>}
          <div className={`${classes.columnContent} ${isEditMode ? classes.editMode : ""}`}>
            <Area name="rightColumn" nodeType="jnt:contentList" />
          </div>
        </div>
      </div>
    );
  },
);
