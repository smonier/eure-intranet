import { jahiaComponent, Render, Area } from "@jahia/javascript-modules-library";
import { Layout } from "../Layout";
import styles from "./home.module.css";

type HomePageProps = {
  "jcr:title": string;
};

/**
 * Employee Portal Home Page Template
 */
jahiaComponent(
  {
    componentType: "template",
    nodeType: "jnt:page",
    name: "home",
    displayName: "Employee Portal Home",
  },
  ({ "jcr:title": title }: HomePageProps) => (
    <Layout title={title}>
      <Render content={{ nodeType: "euint:navBar" }} />

      <main>
        <section id="content" className={styles.contentZone}>
          <div className={styles.container}>
            <div className={styles.contentGrid}>
              <Area name="alerts" allowedNodeTypes={["euint:alertContainer"]} />
            </div>

            <div className={styles.twoColumnRow}>
              <div className={styles.columnLeft}>
                <Area name="leftColumn" />
              </div>
              <div className={styles.columnRight}>
                <Area name="rightColumn" />
              </div>
            </div>

            <div className={styles.newsRow}>
              <div className={styles.newsMain}>
                <Area name="newslist" />
              </div>
              <div className={styles.newsSidebar}>
                <Area name="newsSidebar" />
              </div>
            </div>

            <div className={styles.contentGrid}>
              <div className={styles.eventsArea}>
                <Area name="eventlist" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  ),
);
