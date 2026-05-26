import { jahiaComponent, Render, Area } from "@jahia/javascript-modules-library";
import { Layout } from "../Layout";
import styles from "./home.module.css";

type HomePageProps = {
  "jcr:title": string;
};

jahiaComponent(
  {
    componentType: "template",
    nodeType: "jnt:page",
    name: "home",
    displayName: "Intranet Eurélintranet — Accueil",
  },
  ({ "jcr:title": title }: HomePageProps) => (
    <Layout title={title}>
      <Render content={{ nodeType: "euint:navBar" }} />

      <main>
        {/* Alerts banner — full width above everything */}
        <Area name="alerts" allowedNodeTypes={["euint:alertBanner"]} />

        {/* Hero banner */}
        <Area name="hero" allowedNodeTypes={["euint:hero"]} />

        {/* ProfileDashboard — personalization centrepiece */}
        <Area
          name="profileDashboard"
          allowedNodeTypes={["euint:profileDashboard"]}
        />

        {/* Quick services grid */}
        <section className={styles.servicesZone}>
          <div className={styles.container}>
            <Area name="quicklinks" allowedNodeTypes={["euint:servicesGrid", "euimix:component"]} />
          </div>
        </section>

        {/* Shared content below the profile fold */}
        <section className={styles.sharedZone}>
          <div className={styles.container}>
            {/* Main news + sidebar */}
            <div className={styles.newsRow}>
              <div className={styles.newsMain}>
                <Area name="newslist" allowedNodeTypes={["euint:news", "euimix:component"]} />
              </div>
              <div className={styles.newsSidebar}>
                <Area name="newsSidebar" allowedNodeTypes={["euimix:component"]} />
              </div>
            </div>

            {/* Events full width */}
            <Area name="eventlist" allowedNodeTypes={["euint:event", "euimix:component"]} />
          </div>
        </section>
      </main>
    </Layout>
  ),
);
