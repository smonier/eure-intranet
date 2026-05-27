import {
  getNodesByJCRQuery,
  Island,
  jahiaComponent,
  Render,
  server,
} from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper, JCRSessionWrapper, JCRValueWrapper } from "org.jahia.services.content";
import type { RenderContext } from "org.jahia.services.render";
import classes from "./default.module.css";
import alert from "~/templates/css/alert.module.css";
import { t } from "i18next";
import { buildQuery, getContentTypeLabel } from "./utils";
import type { JcrQueryProps } from "./types";
import { Col, HeadingSection, Row } from "~/components/shared";
import JcrQueryControls from "./JcrQueryControls.client.jsx";
import type { CategoryMeta } from "./JcrQueryControls.client.jsx";

const PAGE_SIZE = 6;

/** Extract j:defaultCategory UUIDs from a node (non-throwing) */
function getNodeCategoryIds(node: JCRNodeWrapper): string[] {
  try {
    if (!node.hasProperty("j:defaultCategory")) return [];
    const prop = node.getProperty("j:defaultCategory");
    const vals = prop.getValues() as JCRValueWrapper[];
    return vals
      .filter((v) => v != null)
      .map((v) => {
        try { return (v as unknown as { getString: () => string }).getString(); } catch { return null; }
      })
      .filter(Boolean) as string[];
  } catch {
    return [];
  }
}

/** Get display name for a category node by UUID (non-throwing) */
function getCategoryName(session: JCRSessionWrapper, uuid: string): string {
  try {
    const catNode = session.getNodeByIdentifier(uuid);
    return catNode.getDisplayableName() || catNode.getName();
  } catch {
    return uuid;
  }
}

jahiaComponent(
  {
    nodeType: "euint:jcrQuery",
    name: "default",
    componentType: "view",
  },
  (
    {
      "jcr:title": title,
      type,
      criteria,
      sortDirection,
      maxItems,
      startNode,
      excludeNodes,
      filter,
      noResultText,
      "j:subNodesView": subNodeView,
      "j:view": queryView,
      loadMore,
      categoryFilter,
    }: JcrQueryProps,
    { currentNode, renderContext }: { currentNode: JCRNodeWrapper; renderContext: RenderContext },
  ) => {
    const { jcrQuery, warn } = buildQuery({
      jempQuery: {
        "jcr:title": title,
        type,
        criteria,
        sortDirection,
        startNode,
        filter,
        excludeNodes,
      },
      t,
      server,
      currentNode,
      renderContext,
    });

    // Always fetch all items — client handles load-more pagination
    const queryContent = getNodesByJCRQuery(currentNode.getSession(), jcrQuery, maxItems || -1);
    const itemCount = queryContent ? queryContent.length : 0;
    const contentTypeLabel = getContentTypeLabel(type);
    const viewLabel = subNodeView || t("jempnt_jcrQuery.infoPanel.defaultView");
    const queryViewLabel = queryView || t("jempnt_jcrQuery.infoPanel.defaultView");

    const isInteractive = loadMore || categoryFilter;

    // ── Build per-item category metadata (only needed when categoryFilter is on) ──
    const session = currentNode.getSession() as JCRSessionWrapper;

    // Map: categoryId → CategoryMeta (deduplicated across all results)
    const categoryMap = new Map<string, CategoryMeta>();
    const itemCategoryIds: string[][] = [];

    if (isInteractive && queryContent) {
      queryContent.forEach((node) => {
        const ids = getNodeCategoryIds(node);
        itemCategoryIds.push(ids);
        if (categoryFilter) {
          ids.forEach((id) => {
            if (!categoryMap.has(id)) {
              categoryMap.set(id, { id, name: getCategoryName(session, id) });
            }
          });
        }
      });
    }

    const availableCategories: CategoryMeta[] = Array.from(categoryMap.values());

    // Unique ID to link island controls to their item grid in the DOM
    const queryId = currentNode.getIdentifier();

    return (
      <div className={classes.root}>
        {/* ── Edit-mode info panel ── */}
        {renderContext.isEditMode() && (
          <div className={classes.infoPanel}>
            <div className={classes.infoPanelTitle}>{t("jempnt_jcrQuery.infoPanel.title")}</div>
            <div className={classes.infoPanelContent}>
              <div className={classes.infoPanelItem}>
                <div className={classes.infoPanelLabel}>{t("jempnt_jcrQuery.infoPanel.queryView")}</div>
                <div className={classes.infoPanelValue}>{queryViewLabel}</div>
              </div>
              <div className={classes.infoPanelItem}>
                <div className={classes.infoPanelLabel}>{t("jempnt_jcrQuery.infoPanel.contentType")}</div>
                <div className={classes.infoPanelValue}>{contentTypeLabel}</div>
              </div>
              <div className={classes.infoPanelItem}>
                <div className={classes.infoPanelLabel}>{t("jempnt_jcrQuery.infoPanel.itemCount")}</div>
                <div className={classes.infoPanelValue}>
                  {itemCount}{" "}
                  {itemCount === 1 ? t("jempnt_jcrQuery.infoPanel.item") : t("jempnt_jcrQuery.infoPanel.items")}
                </div>
              </div>
              <div className={classes.infoPanelItem}>
                <div className={classes.infoPanelLabel}>{t("jempnt_jcrQuery.infoPanel.view")}</div>
                <div className={classes.infoPanelValue}>{viewLabel}</div>
              </div>
              {loadMore && (
                <div className={classes.infoPanelItem}>
                  <div className={classes.infoPanelLabel}>Load more</div>
                  <div className={classes.infoPanelValue}>✓ Activé ({PAGE_SIZE} par {PAGE_SIZE})</div>
                </div>
              )}
              {categoryFilter && (
                <div className={classes.infoPanelItem}>
                  <div className={classes.infoPanelLabel}>Filtre catégories</div>
                  <div className={classes.infoPanelValue}>
                    ✓ Activé — {availableCategories.length} catégorie(s) trouvée(s)
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {title && queryContent && queryContent.length > 0 && <HeadingSection title={title} />}

        {renderContext.isEditMode() && warn && (
          <div className={alert.warning} role="alert">{warn}</div>
        )}

        {queryContent && queryContent.length > 0 && (
          <>
            {/* Island: renders filter chips ABOVE the grid + load-more button BELOW */}
            {isInteractive && !renderContext.isEditMode() && (
              <Island
                component={JcrQueryControls}
                props={{
                  queryId,
                  categories: availableCategories,
                  loadMore: loadMore ?? false,
                  categoryFilter: categoryFilter ?? false,
                  pageSize: PAGE_SIZE,
                  total: itemCount,
                }}
              />
            )}

            {/* Grid with data attributes for DOM-based filtering */}
            <Row className={classes.main} data-qgrid={queryId}>
              {queryContent.map((node, idx) => {
                const catIds = isInteractive ? (itemCategoryIds[idx] ?? []) : [];
                // Items beyond PAGE_SIZE get data-lm-visible="false" initially (CSS hides them)
                const hiddenByDefault = loadMore && idx >= PAGE_SIZE;
                return (
                  <Col
                    key={node.getIdentifier()}
                    data-qitem={queryId}
                    data-categories={catIds.join(",")}
                    data-cat-visible="true"
                    data-lm-visible={hiddenByDefault ? "false" : "true"}
                  >
                    <Render node={node as JCRNodeWrapper} view={subNodeView || "default"} readOnly />
                  </Col>
                );
              })}
            </Row>
          </>
        )}

        {(!queryContent || queryContent.length === 0) && renderContext.isEditMode() && (
          <div className={alert.dark} role="alert">
            {t(noResultText || "query.noResult")}
          </div>
        )}
      </div>
    );
  },
);
