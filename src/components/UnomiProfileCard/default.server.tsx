import { jahiaComponent, Island } from "@jahia/javascript-modules-library";
import UnomiProfileCardIsland from "./island.client";

type Props = {
  "jcr:title"?: string;
  name?: string;
  "j:nodename"?: string;
};

jahiaComponent(
  {
    nodeType: "euint:unomiProfileCard",
    name: "default",
    componentType: "view",
  },
  (props: Props) => {
    const { "jcr:title": title, name } = props;
    const nodeName = props["j:nodename"] || name;
    return <Island component={UnomiProfileCardIsland} props={{ title, name: nodeName }} />;
  },
);
