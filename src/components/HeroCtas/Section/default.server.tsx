import { buildNodeUrl, jahiaComponent, RenderChildren } from "@jahia/javascript-modules-library";
import classes from "./component.module.css";
import type { Props } from "./types.js";

// Declare how to render the component
jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:heroSection",
    displayName: "Hero Section",
  },
  ({ title, subtitle, background }: Props) => (
    <header
      className={classes.hero}
      style={{ backgroundImage: `url(${buildNodeUrl(background)})` }}
    >
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <RenderChildren />
      </div>
    </header>
  ),
);
