import { jahiaComponent, buildNodeUrl } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import { t } from "i18next";
import type { Props } from "./types.js";
import classes from "./horizontal.module.css";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:news",
    name: "horizontal",
    displayName: "News Horizontal",
  },
  (rawProps, { currentNode }) => {
    const props = rawProps as unknown as Props;
    const node = currentNode as JCRNodeWrapper;
    const heroImage = props["eui:heroImage"];
    const url = buildNodeUrl(node);
    const publishDate = props["eui:publishDate"]
      ? new Date(props["eui:publishDate"]).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : null;
    const tags = props["j:tagList"] ?? [];
    const direction = props["eui:direction"];

    return (
      <article className={classes.card}>
        <a href={url} className={classes.link}>
          {heroImage && (
            <div className={classes.imageWrapper}>
              <img className={classes.image} src={buildNodeUrl(heroImage)} alt="" />
            </div>
          )}
          <div className={classes.content}>
            <div className={classes.meta}>
              {publishDate && <time className={classes.date}>{publishDate}</time>}
              {direction && <span className={classes.direction}>{direction}</span>}
            </div>
            <h3 className={classes.title}>{props["jcr:title"]}</h3>
            {props["eui:summary"] && (
              <p className={classes.summary}>{props["eui:summary"]}</p>
            )}
            {tags.length > 0 && (
              <div className={classes.tags}>
                {tags.map((tag) => (
                  <span key={tag} className={classes.tag}>{tag}</span>
                ))}
              </div>
            )}
            <span className={classes.readMore}>{t("eui.label.readMore", "Lire la suite")} →</span>
          </div>
        </a>
      </article>
    );
  },
);
