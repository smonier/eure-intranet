import { jahiaComponent, Render } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:cafeteriaMenuItem",
    name: "default",
    displayName: "Cafeteria Menu Item",
  },
  ({}, { currentNode }: { currentNode?: JCRNodeWrapper }) => {
    if (!currentNode) {
      return <></>;
    }

    return <Render node={currentNode} view="card" />;
  },
);
