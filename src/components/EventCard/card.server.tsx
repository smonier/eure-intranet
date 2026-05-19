import { jahiaComponent, buildNodeUrl } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { Props } from "./types.js";
import classes from "./card.module.css";

const formatDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:event",
    name: "card",
    displayName: "Event Card Teaser",
  },
  (rawProps, { currentNode }) => {
    const props = rawProps as Props;
    const node = currentNode as JCRNodeWrapper;
    const url = buildNodeUrl(node);
    const startDate = formatDate(props["eui:start"]);
    const startTime = formatTime(props["eui:start"]);

    return (
      <article className={classes.card}>
        <a href={url} className={classes.link}>
          <div className={classes.content}>
            {startDate && (
              <div className={classes.dateBox}>
                <span className={classes.date}>{startDate}</span>
                {startTime && <span className={classes.time}>{startTime}</span>}
              </div>
            )}
            <div className={classes.details}>
              <h3 className={classes.title}>{props["jcr:title"]}</h3>
              {props["eui:location"] && (
                <p className={classes.location}>📍 {props["eui:location"]}</p>
              )}
              {props["eui:summary"] && <p className={classes.summary}>{props["eui:summary"]}</p>}
              <span className={classes.readMore}>View details →</span>
            </div>
          </div>
        </a>
      </article>
    );
  },
);
