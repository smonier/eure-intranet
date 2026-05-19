import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import type { JobPostingProps } from "./types";
import classes from "./component.module.css";
import {
  buildJobPostingJsonLd,
  formatDate,
  formatSalary,
  resolveApplyLink,
  resolveLocale,
  toIsoDate,
} from "./utils";

type MetaEntry = { label: string; value?: string; itemProp?: string };

const metaEntries = (props: JobPostingProps, locale: string): MetaEntry[] => {
  return [
    {
      label: t("jobPosting.meta.department", "Department"),
      value: props["eui:department"],
    },
    {
      label: t("jobPosting.meta.location", "Location"),
      value: props["eui:jobLocation"],
    },
    {
      label: t("jobPosting.meta.employmentType", "Employment type"),
      value: props["eui:employmentType"],
      itemProp: "employmentType",
    },
    {
      label: t("jobPosting.meta.workplace", "Workplace"),
      value: props["eui:workplaceType"],
      itemProp: "jobLocationType",
    },
    {
      label: t("jobPosting.meta.experience", "Experience level"),
      value: props["eui:experienceLevel"],
    },
    {
      label: t("jobPosting.meta.salary", "Salary"),
      value: formatSalary(props, locale),
    },
    {
      label: t("jobPosting.meta.posted", "Posted"),
      value: formatDate(props["eui:datePosted"], locale),
    },
    {
      label: t("jobPosting.meta.validThrough", "Apply by"),
      value: formatDate(props["eui:validThrough"], locale),
    },
  ].filter((entry) => entry.value);
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:jobPosting",
    name: "default",
    displayName: "Job Posting",
  },
  (rawProps: JobPostingProps, { renderContext }) => {
    const locale = resolveLocale(renderContext as RenderContext);
    const props = rawProps;
    const applyLink = resolveApplyLink(props);
    const applyUrl = applyLink.href;
    const companyName = props["eui:company"];
    const companyUrl = props["eui:companyUrl"];
    const kicker =
      props["eui:subtitle"] ||
      [companyName, props["eui:department"]].filter((value) => value && value.length > 0).join(" • ");

    const summary = props["eui:summary"];
    const description = props["eui:description"];
    const entries = metaEntries(props, locale);
    const jsonLd = buildJobPostingJsonLd(props, locale, applyUrl, t("jobPosting.schema.remoteFriendly", "Remote"));
    const datePostedIso = toIsoDate(props["eui:datePosted"]);
    const validThroughIso = toIsoDate(props["eui:validThrough"]);

    return (
      <article className={classes.card} itemScope itemType="https://schema.org/JobPosting">
        <header className={classes.header}>
          <div className={classes.badgeRow}>
            <span className={classes.badge}>{t("jobPosting.label.badge", "Now hiring")}</span>
            {props["eui:employmentType"] && <span className={classes.badge}>{props["eui:employmentType"]}</span>}
            {props["eui:workplaceType"] && <span className={classes.badge}>{props["eui:workplaceType"]}</span>}
          </div>
          {kicker && (
            <p className={classes.subtitle}>
              {kicker}
            </p>
          )}
          <h2 className={classes.title} itemProp="title">
            {props["jcr:title"]}
          </h2>
          {summary && <p className={classes.summary}>{summary}</p>}
        </header>

        {entries.length > 0 && (
          <div className={classes.metaGrid}>
            {entries.map((entry) => (
              <div className={classes.metaItem} key={`${entry.label}-${entry.value}`}>
                <span className={classes.metaLabel}>{entry.label}</span>
                <span className={classes.metaValue} {...(entry.itemProp ? { itemProp: entry.itemProp } : {})}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {description && (
          <div className={classes.description} dangerouslySetInnerHTML={{ __html: description }} itemProp="description" />
        )}

        <div className={classes.ctaRow}>
          {applyUrl && (
            <a className={classes.primaryCta} href={applyUrl} target={applyLink.target} rel={applyLink.rel}>
              {t("jobPosting.cta.apply", "Apply now")}
            </a>
          )}
          {companyUrl && (
            <a className={classes.secondaryLink} href={companyUrl} target="_blank" rel="noopener noreferrer">
              {t("jobPosting.cta.companySite", "View company site")}
            </a>
          )}
        </div>

        <script
          type="application/ld+json"
          className={classes.schemaScript}
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />

        {props["eui:employmentType"] && (
          <meta itemProp="employmentType" content={props["eui:employmentType"]} />
        )}
        {props["eui:workplaceType"] && <meta itemProp="jobLocationType" content={props["eui:workplaceType"]} />}
        {applyUrl && <meta itemProp="directApply" content="true" />}
        {datePostedIso && <meta itemProp="datePosted" content={datePostedIso} />}
        {validThroughIso && <meta itemProp="validThrough" content={validThroughIso} />}

        {(companyName || companyUrl) && (
          <span itemProp="hiringOrganization" itemScope itemType="https://schema.org/Organization" hidden>
            {companyName && <meta itemProp="name" content={companyName} />}
            {companyUrl && <meta itemProp="sameAs" content={companyUrl} />}
          </span>
        )}

        {(props["eui:jobLocation"] ||
          props["eui:addressLocality"] ||
          props["eui:addressRegion"] ||
          props["eui:postalCode"] ||
          props["eui:country"]) && (
          <span itemProp="jobLocation" itemScope itemType="https://schema.org/Place" hidden>
            <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              {props["eui:jobLocation"] && <meta itemProp="streetAddress" content={props["eui:jobLocation"]} />}
              {props["eui:addressLocality"] && <meta itemProp="addressLocality" content={props["eui:addressLocality"]} />}
              {props["eui:addressRegion"] && <meta itemProp="addressRegion" content={props["eui:addressRegion"]} />}
              {props["eui:postalCode"] && <meta itemProp="postalCode" content={props["eui:postalCode"]} />}
              {props["eui:country"] && <meta itemProp="addressCountry" content={props["eui:country"]} />}
            </span>
          </span>
        )}
      </article>
    );
  },
);
