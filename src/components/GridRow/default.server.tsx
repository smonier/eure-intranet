import { Area, jahiaComponent } from "@jahia/javascript-modules-library";
import clsx from "clsx";
import classes from "./component.module.css";
import type { GridRowProps } from "./types";
import type { RenderContext } from "org.jahia.services.render";
import type { JCRNodeWrapper } from "org.jahia.services.content";

const MAX_COLUMNS = 4;
const MIN_COLUMNS = 1;
const DEFAULT_COLUMNS = 3;

const getColumnCount = (raw: unknown) => {
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    return DEFAULT_COLUMNS;
  }
  return Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, Math.trunc(parsed)));
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:gridRow",
    name: "default",
    displayName: "Grid Row",
  },
  (
    props: GridRowProps,
    {
      renderContext,
      currentNode,
    }: { renderContext: RenderContext; currentNode: JCRNodeWrapper },
  ) => {
    const columns = getColumnCount(props["eui:columns"]);
    const isEditMode = renderContext.isEditMode();
    const nodeId =
      currentNode && typeof currentNode.getIdentifier === "function"
        ? currentNode.getIdentifier()
        : undefined;
    const safeSuffix = nodeId
      ? nodeId.replace(/[^A-Za-z0-9]/g, "").slice(-6)
      : "default";

    const columnEntries = Array.from({ length: columns }, (_, index) => ({
      areaName: `column${index + 1}_${safeSuffix}`,
    }));

    return (
      <div
        className={classes.gridRow}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {columnEntries.map(({ areaName }) => (
          <div
            key={areaName}
            className={clsx(classes.column, isEditMode && classes.columnEdit)}
          >
            <div className={classes.columnContent}>
              <Area name={areaName} />
            </div>
          </div>
        ))}
      </div>
    );
  },
);
