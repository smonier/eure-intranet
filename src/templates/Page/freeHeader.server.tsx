import { Area, jahiaComponent, Render } from "@jahia/javascript-modules-library";
import { Layout } from "../Layout";
import styles from "./home.module.css";

type BasicPageProps = {
  "jcr:title": string;
};

jahiaComponent(
  {
    componentType: "template",
    nodeType: "jnt:page",
    name: "freeHeader",
    displayName: "Section Page with Free Header",
  },
  ({ "jcr:title": title }: BasicPageProps) => (
    <Layout title={title}>
      <Render content={{ nodeType: "euint:navBar" }} />
      <Area name="header" numberOfItems={1} />
      <main>
        <section id="content" className={styles.contentZone}>
          <div className={styles.container}>
            <Area name="main" />
          </div>
        </section>
      </main>
    </Layout>
  ),
);
