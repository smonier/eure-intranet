import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { Props } from "./types.js";
import classes from "./component.module.css";
import { resolveLink } from "~/utils/linkTo";

const formatDateTime = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString();
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:event",
    name: "default",
    displayName: "Event Card",
  },
  (rawProps) => {
    const props = rawProps as Props;
    const start = formatDateTime(props["eui:start"]);
    const end = formatDateTime(props["eui:end"]);
    const onlineLink = resolveLink(props);
    const onlineUrl = onlineLink.href;
    const onlineTarget = onlineLink.target ?? "_self";
    const onlineRel = onlineLink.rel ?? (onlineTarget === "_blank" ? "noopener noreferrer" : undefined);

    return (
      <article className={classes.card}>
        <h2 className={classes.title}>{props["jcr:title"]}</h2>
        {props["eui:summary"] && <p className={classes.summary}>{props["eui:summary"]}</p>}
        {(start || end || props["eui:location"]) && (
          <div className={classes.meta}>
            {start && (
              <span>
                {t("jemp.label.starts")}: {start}
              </span>
            )}
            {end && (
              <span>
                {t("jemp.label.ends")}: {end}
              </span>
            )}
            {props["eui:location"] && (
              <span>
                {t("jemp.label.location")}: {props["eui:location"]}
              </span>
            )}
          </div>
        )}
        {(onlineUrl || props["eui:requiresRSVP"]) && (
          <div className={classes.actions}>
            {onlineUrl && (
              <a className={classes.link} href={onlineUrl} target={onlineTarget} rel={onlineRel}>
                {t("jemp.label.joinOnline")}
              </a>
            )}
            {props["eui:requiresRSVP"] && (
              <span className={classes.rsvp}>{t("jemp.label.rsvpRequired")}</span>
            )}
          </div>
        )}
      </article>
    );
  },
);
