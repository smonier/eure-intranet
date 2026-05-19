import { getChildNodes, Island, jahiaComponent } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { Resource } from "org.jahia.services.render";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import CafeteriaMenuClient from "./CafeteriaMenu.client";
import classes from "./fullPage.module.css";
import type { CafeteriaMenuItem, CafeteriaMenuProps } from "./types";
import {
  buildJsonLd,
  collectMenuItems,
  normaliseLocaleCode,
  normaliseMenuDate,
  toMenuItem,
} from "./utils";

const describeWeek = (items: CafeteriaMenuItem[], locale: string) => {
  if (items.length === 0) {
    return undefined;
  }
  const dates = items
    .map((item) => item.menuDate)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) {
    return undefined;
  }

  const first = dates[0];
  const last = dates[dates.length - 1];

  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const firstLabel = formatter.format(first);
    const lastLabel = formatter.format(last);

    if (firstLabel === lastLabel) {
      return firstLabel;
    }

    return `${firstLabel} – ${lastLabel}`;
  } catch {
    return undefined;
  }
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:cafeteriaMenu",
    name: "fullPage",
    displayName: "Cafeteria Menu - Full Page",
  },
  (
    rawProps: CafeteriaMenuProps & { "jcr:title"?: string },
    {
      currentNode,
      currentResource,
    }: {
      currentNode?: JCRNodeWrapper;
      currentResource: Resource;
    },
  ) => {
    const node = (rawProps.node || currentNode) as JCRNodeWrapper | undefined;
    const locale = normaliseLocaleCode(currentResource.getLocale().getLanguage()) ?? "en";
    const weekLabel = rawProps["eui:weekLabel"] || rawProps["jcr:title"] || "Cafeteria Menu";

    const rawChildren =
      node && typeof node.getSession === "function" ? getChildNodes(node, -1, 0) : [];

    const childItems = collectMenuItems(rawChildren as JCRNodeWrapper[]);

    const items: CafeteriaMenuItem[] = [];
    childItems.forEach((child) => {
      try {
        items.push(toMenuItem(child as unknown as JCRNodeWrapper, locale));
      } catch (error) {
        console.error("[CafeteriaMenu] Failed to map menu item", error);
      }
    });

    const jsonLd = buildJsonLd(weekLabel, items, locale);

    const weekRange = describeWeek(items, locale);
    const uniqueDays = new Set(
      items
        .map((item) => normaliseMenuDate(item.menuDate))
        .filter((value): value is string => Boolean(value)),
    );

    const dayCountLabel =
      uniqueDays.size > 0
        ? t("cafeteriaMenu.fullPage.days", { count: uniqueDays.size })
        : undefined;

    const itemCountLabel = t("cafeteriaMenu.fullPage.count", { count: items.length });
    const subtitle = t(
      "cafeteriaMenu.fullPage.subtitle",
      "Choose a day to see what the cafeteria is serving. Filters update instantly.",
    );
    const rangeLabel = weekRange
      ? t("cafeteriaMenu.fullPage.range", { range: weekRange })
      : undefined;

    return (
      <section className={classes.root}>
        <header className={classes.hero}>
          <div className={classes.heroInner}>
            <span className={classes.eyebrow}>{weekLabel}</span>
            <h1 className={classes.title}>{weekLabel}</h1>
            <div className={classes.metaRow}>
              {rangeLabel && (
                <span>
                  <strong>{rangeLabel}</strong>
                </span>
              )}
              {dayCountLabel && <span>{dayCountLabel}</span>}
              <span>{itemCountLabel}</span>
            </div>
          </div>
        </header>

        <div className={classes.contentShell}>
          <div className={classes.panel}>
            <div className={classes.panelHeading}>
              <h2 className={classes.panelTitle}>{weekLabel}</h2>
              <p className={classes.panelSubtitle}>{subtitle}</p>
            </div>
            <Island component={CafeteriaMenuClient} props={{ items, locale, weekLabel }} />
          </div>
        </div>

        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd,
            }}
          />
        )}
      </section>
    );
  },
);
