import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import type { JobPostingProps } from "./types";
import classes from "./card.module.css";
import { formatDate, formatSalary, resolveLocale } from "./utils";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:jobPosting",
    name: "cm",
    displayName: "Job Posting - Content Manager Preview",
  },
  (rawProps: JobPostingProps, { renderContext }) => {
    const locale = resolveLocale(renderContext as RenderContext);
    const props = rawProps;

    const summary = props["eui:summary"];
    const employmentType = props["eui:employmentType"];
    const workplace = props["eui:workplaceType"];
    const department = props["eui:department"];
    const company = props["eui:company"];
    const location = props["eui:jobLocation"];
    const salary = formatSalary(props, locale);
    const posted = formatDate(props["eui:datePosted"], locale);
    const deadline = formatDate(props["eui:validThrough"], locale);

    return (
      <article className={classes.card}>
        <div className={classes.link}>
          <div className={classes.body}>
            <div className={classes.header}>
              <div className={classes.badgeRow}>
                <span className={classes.badge}>{t("jobPosting.label.badge", "Now hiring")}</span>
                {employmentType && <span className={classes.badge}>{employmentType}</span>}
                {workplace && <span className={classes.badge}>{workplace}</span>}
              </div>
              <h3 className={classes.title}>{props["jcr:title"]}</h3>
              {summary && <p className={classes.summary}>{summary}</p>}
            </div>

            <div className={classes.metaGrid}>
              {department && (
                <div>
                  <div className={classes.metaLabel}>{t("jobPosting.meta.department", "Department")}</div>
                  <div>{department}</div>
                </div>
              )}
              {location && (
                <div>
                  <div className={classes.metaLabel}>{t("jobPosting.meta.location", "Location")}</div>
                  <div>{location}</div>
                </div>
              )}
              {salary && (
                <div>
                  <div className={classes.metaLabel}>{t("jobPosting.meta.salary", "Salary")}</div>
                  <div>{salary}</div>
                </div>
              )}
              {posted && (
                <div>
                  <div className={classes.metaLabel}>{t("jobPosting.meta.posted", "Posted")}</div>
                  <div>{posted}</div>
                </div>
              )}
              {deadline && (
                <div>
                  <div className={classes.metaLabel}>{t("jobPosting.meta.validThrough", "Apply by")}</div>
                  <div>{deadline}</div>
                </div>
              )}
            </div>

            <div className={classes.footer}>
              <span>{company || department}</span>
              <span>{t("jobPosting.cta.apply", "Apply now")} →</span>
            </div>
          </div>
        </div>
      </article>
    );
  },
);
