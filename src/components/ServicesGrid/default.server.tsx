import type { CSSProperties } from "react";
import { jahiaComponent, RenderChildren } from "@jahia/javascript-modules-library";
import type { RenderContext } from "org.jahia.services.render";
import classes from "./component.module.css";

interface ServicesGridProps {
  "jcr:title"?: string;
  "eui:columns"?: number;
}

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:servicesGrid",
    name: "default",
    displayName: "Services Grid",
  },
  ({ "jcr:title": title, "eui:columns": columns = 4 }: ServicesGridProps, { renderContext }) => {
    const isEdit = (renderContext as RenderContext).isEditMode();
    return (
      <section className={classes.section}>
        {title && <h2 className={classes.heading}>{title}</h2>}
        <div
          className={classes.grid}
          style={{ "--cols": String(columns) } as CSSProperties}
          data-edit={isEdit || undefined}
        >
          <RenderChildren />
        </div>
      </section>
    );
  },
);
