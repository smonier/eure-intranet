import { buildNodeUrl, jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { RenderContext } from "org.jahia.services.render";
import type { JobPostingProps } from "./types";
import classes from "./list.module.css";
import { formatDate, formatSalary, resolveApplyLink, resolveLocale } from "./utils";

const resolveDetailUrl = (
  node: JCRNodeWrapper | undefined,
  fallback?: string,
) => {
  if (node && typeof node.getIdentifier === "function") {
    return buildNodeUrl(node);
  }
  return fallback;
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:jobPosting",
    name: "list",
    displayName: "Job Posting - List Item",
  },
  (rawProps: JobPostingProps, { renderContext, currentNode }) => {
    const locale = resolveLocale(renderContext as RenderContext);
    const props = rawProps;

    const title = props["jcr:title"];
    const summary = props["eui:summary"];
    const company = props["eui:company"];
    const employmentType = props["eui:employmentType"];
    const workplace = props["eui:workplaceType"];
    const location = props["eui:jobLocation"] || props["eui:addressLocality"];
    const salary = formatSalary(props, locale);
    const experience = props["eui:experienceLevel"];
    const postedDate = formatDate(props["eui:datePosted"], locale);
    const applyLink = resolveApplyLink(props);
    const ctaUrl = applyLink.href;
    const detailUrl = resolveDetailUrl(currentNode as JCRNodeWrapper | undefined, ctaUrl);
    const viewDetailsLabel = t("jobPosting.cta.viewDetails", "View details");
    const linkTarget = detailUrl && detailUrl === ctaUrl ? applyLink.target : undefined;
    const linkRel = detailUrl && detailUrl === ctaUrl ? applyLink.rel : undefined;

    return (
      <article className={classes.item} itemScope itemType="https://schema.org/JobPosting">
        <div className={classes.meta}>
          <span className={classes.label}>{t("jobPosting.label.badge", "Now hiring")}</span>
          {employmentType && <span>{employmentType}</span>}
          {workplace && <span>{workplace}</span>}
        </div>

        <h3 className={classes.title} itemProp="title">
          {detailUrl ? (
            <a
              className={classes.titleLink}
              href={detailUrl}
              target={linkTarget}
              rel={linkRel}
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>

        {summary && (
          <p className={classes.summary} itemProp="description">
            {summary}
          </p>
        )}

        <div className={classes.details}>
          {location && (
            <div className={classes.detailItem}>
              <span className={classes.detailLabel}>{t("jobPosting.meta.location", "Location")}</span>
              <span className={classes.detailValue}>{location}</span>
            </div>
          )}
          {salary && (
            <div className={classes.detailItem}>
              <span className={classes.detailLabel}>{t("jobPosting.meta.salary", "Salary")}</span>
              <span className={classes.detailValue}>{salary}</span>
            </div>
          )}
          {experience && (
            <div className={classes.detailItem}>
              <span className={classes.detailLabel}>{t("jobPosting.meta.experience", "Experience level")}</span>
              <span className={classes.detailValue}>{experience}</span>
            </div>
          )}
          {postedDate && (
            <div className={classes.detailItem}>
              <span className={classes.detailLabel}>{t("jobPosting.meta.posted", "Posted")}</span>
              <span className={classes.detailValue}>{postedDate}</span>
            </div>
          )}
        </div>

        <div className={classes.footer}>
          {company && <span className={classes.company}>{company}</span>}
          {detailUrl && (
            <a
              className={classes.link}
              href={detailUrl}
              target={linkTarget}
              rel={linkRel}
            >
              {viewDetailsLabel} →
            </a>
          )}
        </div>
      </article>
    );
  },
);
