import { jahiaComponent, buildNodeUrl } from "@jahia/javascript-modules-library";
import type { Props } from "./types.js";
import classes from "./component.module.css";

const renderBody = (body?: string) => {
  if (!body) return null;
  return <div className={classes.body} dangerouslySetInnerHTML={{ __html: body }} />;
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:news",
    name: "default",
    displayName: "News Article",
  },
  (rawProps) => {
    const props = rawProps as unknown as Props;
    const heroImage = props["eui:heroImage"];

    return (
      <article className={classes.article}>
        {heroImage && <img className={classes.hero} src={buildNodeUrl(heroImage)} alt="" />}
        <h1 className={classes.title}>{props["jcr:title"]}</h1>
        {props["eui:summary"] && <p className={classes.summary}>{props["eui:summary"]}</p>}
        {renderBody(props["eui:body"])}
      </article>
    );
  },
);
