import { jahiaComponent, RenderChildren } from "@jahia/javascript-modules-library";
import classes from "./component.module.css";
import type { Props } from "./types.js";
import type { RenderContext } from "org.jahia.services.render";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:footer",
    displayName: "Default Footer",
  },
  ({ notice }: Props, { renderContext }) => {
    return (
      <footer className={classes.footer}>
        {/* In edition mode, links are piled up to make edition easier */}
        <nav
          style={{
            flexDirection: (renderContext as RenderContext).isEditMode() ? "column" : "row",
          }}
        >
          <RenderChildren />
        </nav>
        <p>
          © {new Date().getFullYear()} {notice}
        </p>
      </footer>
    );
  },
);
