import { jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { Props } from "./types.js";
import classes from "./fullPage.module.css";
import { resolveLink } from "~/utils/linkTo";
import { TagsMeta } from "~/utils/tagsMeta.js";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:event",
    name: "fullPage",
    displayName: "Event - Full Page",
  },
  (rawProps) => {
    const props = rawProps as Props;
    const title = props["jcr:title"];
    const summary = props["eui:summary"];
    const startDate = props["eui:start"];
    const tags = props["j:tagList"];
    const categories = props["j:defaultCategory"];
    const endDate = props["eui:end"];
    const location = props["eui:location"];
    const onlineLink = resolveLink(props);
    const onlineUrl = onlineLink.href;
    const onlineTarget = onlineLink.target ?? "_blank";
    const onlineRel = onlineLink.rel ?? (onlineTarget === "_blank" ? "noopener noreferrer" : undefined);
    const requiresRSVP = props["eui:requiresRSVP"];

    const formatDateTime = (dateStr?: string) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return {
        date: date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        full: date.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
    };

    const start = formatDateTime(startDate);
    const end = formatDateTime(endDate);

    return (
      <article className={classes.event}>
        {/* Hero Banner */}
        <div className={classes.hero}>
          <div className={classes.heroPattern} />
          <div className={classes.heroContent}>
            <div className={classes.container}>
              <div className={classes.eventBadge}>
                <svg
                  className={classes.badgeIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                </svg>
                {t("jemp.label.event")}
              </div>
              <h1 className={classes.title}>{title}</h1>
              {summary && <p className={classes.summary}>{summary}</p>}
            </div>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className={classes.content}>
          <div className={classes.container}>
            <div className={classes.grid}>
              {/* Main Info Column */}
              <div className={classes.mainColumn}>
                {/* Date & Time Card */}
                <div className={classes.card}>
                  <div className={classes.cardHeader}>
                    <svg
                      className={classes.cardIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <polyline points="12 6 12 12 16 14" strokeWidth="2" />
                    </svg>
                    <h2>{t("jemp.label.dateTime")}</h2>
                  </div>
                  <div className={classes.cardContent}>
                    {start && (
                      <div className={classes.dateTimeBlock}>
                        <div className={classes.label}>{t("jemp.label.start")}</div>
                        <div className={classes.dateTime}>
                          <div className={classes.date}>{start.date}</div>
                          <div className={classes.time}>{start.time}</div>
                        </div>
                      </div>
                    )}
                    {end && (
                      <div className={classes.dateTimeBlock}>
                        <div className={classes.label}>{t("jemp.label.end")}</div>
                        <div className={classes.dateTime}>
                          <div className={classes.date}>{end.date}</div>
                          <div className={classes.time}>{end.time}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Card */}
                {(location || onlineUrl) && (
                  <div className={classes.card}>
                    <div className={classes.cardHeader}>
                      <svg
                        className={classes.cardIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" />
                        <circle cx="12" cy="10" r="3" strokeWidth="2" />
                      </svg>
                      <h2>{t("jemp.label.location")}</h2>
                    </div>
                    <div className={classes.cardContent}>
                      {location && (
                        <div className={classes.locationBlock}>
                          <div className={classes.locationText}>{location}</div>
                        </div>
                      )}
                      {onlineUrl && (
                        <div className={classes.onlineBlock}>
                          <div className={classes.onlineBadge}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" strokeWidth="2" />
                              <path
                                d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                                strokeWidth="2"
                              />
                            </svg>
                            {t("jemp.label.onlineEvent")}
                          </div>
                          <a href={onlineUrl} className={classes.joinLink} target={onlineTarget} rel={onlineRel}>
                            {t("jemp.label.joinOnlineMeeting")} →
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className={classes.sidebar}>
                {/* RSVP Card */}
                {requiresRSVP && (
                  <div className={`${classes.card} ${classes.rsvpCard}`}>
                    <div className={classes.rsvpContent}>
                      <svg
                        className={classes.rsvpIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M9 11l3 3L22 4"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <h3>{t("jemp.label.rsvpRequired")}</h3>
                      <p>{t("jemp.label.confirmAttendance")}</p>
                      <button className={classes.rsvpButton}>{t("jemp.label.registerNow")}</button>
                    </div>
                  </div>
                )}

                {/* Quick Info */}
                <div className={classes.quickInfo}>
                  <h3 className={classes.quickInfoTitle}>{t("jemp.label.quickInfo")}</h3>
                  <div className={classes.infoList}>
                    {start && (
                      <div className={classes.infoItem}>
                        <span className={classes.infoLabel}>{t("jemp.label.when")}</span>
                        <span className={classes.infoValue}>{start.date}</span>
                      </div>
                    )}
                    {location && (
                      <div className={classes.infoItem}>
                        <span className={classes.infoLabel}>{t("jemp.label.where")}</span>
                        <span className={classes.infoValue}>{location}</span>
                      </div>
                    )}
                    {requiresRSVP !== undefined && (
                      <div className={classes.infoItem}>
                        <span className={classes.infoLabel}>{t("jemp.label.rsvp")}</span>
                        <span className={classes.infoValue}>
                          {requiresRSVP ? t("jemp.label.required") : t("jemp.label.notRequired")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TagsMeta tags={tags} categories={categories} />
        </div>
      </article>
    );
  },
);
