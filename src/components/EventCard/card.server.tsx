import { jahiaComponent, buildNodeUrl } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { Props } from "./types.js";
import classes from "./card.module.css";

const formatDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDayNum = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", { day: "2-digit" });
};

const getMonthShort = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();
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
    const startTime = formatTime(props["eui:start"]);
    const dayNum = getDayNum(props["eui:start"]);
    const monthShort = getMonthShort(props["eui:start"]);

    return (
      <article className={classes.card}>
        <a href={url} className={classes.link}>
          <div className={classes.content}>
            {dayNum && (
              <div className={classes.dateBox}>
                <span className={classes.dayNum}>{dayNum}</span>
                <span className={classes.month}>{monthShort}</span>
                {startTime && <span className={classes.time}>{startTime}</span>}
              </div>
            )}
            <div className={classes.details}>
              <h3 className={classes.title}>{props["jcr:title"]}</h3>
              {props["eui:location"] && (
                <p className={classes.location}>📍 {props["eui:location"]}</p>
              )}
              {props["eui:summary"] && <p className={classes.summary}>{props["eui:summary"]}</p>}
              <span className={classes.readMore}>Voir les détails →</span>
            </div>
          </div>
        </a>
      </article>
    );
  },
);
