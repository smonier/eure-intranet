import { jahiaComponent, buildNodeUrl } from "@jahia/javascript-modules-library";
import type { Props } from "./types.js";
import classes from "./fullPage.module.css";
import { TagsMeta } from "~/utils/tagsMeta.js";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:news",
    name: "fullPage",
    displayName: "News Article - Full Page",
  },
  (rawProps) => {
    const props = rawProps as unknown as Props;
    const title = props["jcr:title"];
    const summary = props["eui:summary"];
    const body = props["eui:body"];
    const heroImage = props["eui:heroImage"];
    const publishDate = props["eui:publishDate"];
    const tags = props["j:tagList"];
    const categories = props["j:defaultCategory"];

    // Get image URL from the file node path
    const formattedDate = publishDate
      ? new Date(publishDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

    return (
      <article className={classes.article}>
        {/* Hero Section */}
        {heroImage && (
          <div className={classes.hero}>
            <div className={classes.heroOverlay} />
            <img src={buildNodeUrl(heroImage)} alt={title} className={classes.heroImage} />
            <div className={classes.heroContent}>
              <div className={classes.container}>
                {formattedDate && (
                  <time className={classes.publishDate} dateTime={publishDate}>
                    {formattedDate}
                  </time>
                )}
                <h1 className={classes.title}>{title}</h1>
                {summary && <p className={classes.summary}>{summary}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className={classes.content}>
          <div className={classes.container}>
            {/* Title for articles without hero image */}
            {!heroImage && (
              <header className={classes.header}>
                {formattedDate && (
                  <time className={classes.publishDate} dateTime={publishDate}>
                    {formattedDate}
                  </time>
                )}
                <h1 className={classes.titleNoHero}>{title}</h1>
                {summary && <p className={classes.summaryNoHero}>{summary}</p>}
              </header>
            )}

            {/* Article Body */}
            {body && <div className={classes.body} dangerouslySetInnerHTML={{ __html: body }} />}

            <TagsMeta tags={tags} categories={categories} />
          </div>
        </div>
      </article>
    );
  },
);
