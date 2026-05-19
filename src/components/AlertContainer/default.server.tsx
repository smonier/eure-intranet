import { jahiaComponent, RenderChildren } from "@jahia/javascript-modules-library";
import type { RenderContext } from "org.jahia.services.render";
import styles from "./component.module.css";

/**
 * Alert Container - displays up to 3 alert banners in a vertical carousel
 */
jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:alertContainer",
    name: "default",
    displayName: "Alert Container",
  },
  (props, { renderContext }) => {
    const context = renderContext as RenderContext & { getMode?: () => string };
    const mode = typeof context.getMode === "function" ? context.getMode() : context.isEditMode() ? "edit" : "live";
    const isAuthoring = mode === "edit";
    const isPreview = mode === "preview";
    const isLive = mode === "live";

    return (
      <div
        className={`${styles.alertContainer} ${isAuthoring ? styles.editMode : styles.viewMode}`}
        data-mode={mode}
      >
        <div className={`${styles.carousel} ${isPreview ? styles.preview : ""} ${isLive ? styles.live : ""}`}>
          <RenderChildren />
        </div>
      </div>
    );
  },
);
