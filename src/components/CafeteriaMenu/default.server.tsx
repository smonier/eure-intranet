import { getChildNodes, Island, Render, jahiaComponent } from "@jahia/javascript-modules-library";
import type { RenderContext, Resource } from "org.jahia.services.render";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import CafeteriaMenuClient from "./CafeteriaMenu.client";
import classes from "./component.module.css";
import type { CafeteriaMenuItem, CafeteriaMenuProps } from "./types";
import { buildJsonLd, collectMenuItems, normaliseLocaleCode, toMenuItem } from "./utils";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:cafeteriaMenu",
    name: "default",
    displayName: "Cafeteria Menu",
  },
  (
    rawProps: CafeteriaMenuProps & { "jcr:title"?: string },
    {
      currentNode,
      currentResource,
      renderContext,
    }: {
      currentNode?: JCRNodeWrapper;
      currentResource: Resource;
      renderContext?: RenderContext;
    },
  ) => {
    const node = (rawProps.node || currentNode) as JCRNodeWrapper | undefined;
    const locale =
      normaliseLocaleCode(currentResource.getLocale().getLanguage()) ?? "en";

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
    let isEdit = false;
    if (renderContext) {
      try {
        if (typeof renderContext.isEditMode === "function") {
          isEdit = renderContext.isEditMode();
        }
      } catch {
        isEdit = false;
      }
    }

    return (
      <section className={classes.menuContainer}>
        <header className={classes.header}>
          <div className={classes.titleRow}>
            <h2 className={classes.weekLabel}>{weekLabel}</h2>
          </div>
        </header>

        {isEdit ? (
          <div className={classes.grid}>
            {childItems.map((child) => {
              try {
                const editNode = child as JCRNodeWrapper;
                const identifier =
                  typeof editNode.getIdentifier === "function"
                    ? editNode.getIdentifier()
                    : editNode.getPath?.() ?? Math.random().toString(36);

                return (
                  <Render
                    key={identifier}
                    node={editNode}
                    view="card"
                    readOnly
                  />
                );
              } catch (error) {
                console.error("[CafeteriaMenu] Failed to render child node", error);
                return null;
              }
            })}
          </div>
        ) : (
          <Island component={CafeteriaMenuClient} props={{ items, locale, weekLabel }} />
        )}

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
