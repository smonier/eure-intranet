import { jahiaComponent, Render } from "@jahia/javascript-modules-library";
import { Layout } from "../Layout.jsx";

import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { RenderContext, Resource } from "org.jahia.services.render";

type BasicPageProps = {
  title: string;
  currentNode: JCRNodeWrapper;
  currentResource: Resource;
  renderContext: RenderContext;
};

jahiaComponent(
  {
    componentType: "template",
    nodeType: "jmix:mainResource",
    priority: -1, // allow to overwrite this template by defining a component with a higher priority. When not specified, the default priority is 0
  },
  ({ title }: BasicPageProps, { currentNode }: BasicPageProps) => (
    <Layout title={title}>
      <Render content={{ nodeType: "euint:navBar" }} />
      <Render node={currentNode} view="fullPage" />
      </Layout>
  ),
);
