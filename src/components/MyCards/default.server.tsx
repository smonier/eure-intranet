import { jahiaComponent, RenderChildren } from "@jahia/javascript-modules-library";
import type { MyCardsProps } from "./types.js";
import classes from "./component.module.css";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:myCards",
    displayName: "My Cards",
  },
  (props: MyCardsProps) => {
    const title = props["jcr:title"];

    return (
      <section className={classes.myCards}>
        {title && <h2 className={classes.title}>{title}</h2>}
        <div className={classes.cardGrid}>
          <RenderChildren />
        </div>
      </section>
    );
  },
);
