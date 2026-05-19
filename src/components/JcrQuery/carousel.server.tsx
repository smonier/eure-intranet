import {
  getNodesByJCRQuery,
  jahiaComponent,
  Render,
  server,
  Island,
} from "@jahia/javascript-modules-library";
import CarouselIsland from "./carousel.island.client";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { RenderContext } from "org.jahia.services.render";
import classes from "./carousel.module.css";
import alert from "~/templates/css/alert.module.css";
import { t } from "i18next";
import { buildQuery, getContentTypeLabel } from "./utils";
import type { JcrQueryProps } from "./types";

jahiaComponent(
  {
    nodeType: "euint:jcrQuery",
    name: "carousel",
    componentType: "view",
    displayName: "JCR Query - Carousel",
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

    const queryContent = getNodesByJCRQuery(currentNode.getSession(), jcrQuery, maxItems || -1);

    // Unique ID for this carousel instance
    const carouselId = `carousel-${currentNode.getIdentifier()}`;

    // In edit mode, show cards in a grid with max 4-5 visible items
    const mode = typeof renderContext.getMode === "function"
      ? renderContext.getMode()
      : renderContext.isEditMode() ? "edit" : "live";
    const isAuthoring = mode === "edit";
    const itemCount = queryContent ? queryContent.length : 0;
    const contentTypeLabel = getContentTypeLabel(type);
    const viewLabel = subNodeView || t("jempnt_jcrQuery.infoPanel.defaultView");
    const queryViewLabel = queryView || t("jempnt_jcrQuery.infoPanel.defaultView");
    const maxVisibleInEdit = 4;
    const visibleItems =
      isAuthoring && queryContent && queryContent.length > maxVisibleInEdit
        ? queryContent.slice(0, maxVisibleInEdit - 1)
        : queryContent;
    const remainingCount =
      isAuthoring && queryContent ? queryContent.length - (maxVisibleInEdit - 1) : 0;

    return (
      <div className={classes.root}>
        <Island component={CarouselIsland} />

        {/* Info panel in edit mode */}
        {isAuthoring && (
          <div className={classes.infoPanel}>
            <div className={classes.infoPanelTitle}>{t("jempnt_jcrQuery.infoPanel.title")}</div>
            <div className={classes.infoPanelContent}>
              <div className={classes.infoPanelItem}>
                <div className={classes.infoPanelLabel}>
                  {t("jempnt_jcrQuery.infoPanel.queryView")}
                </div>
                <div className={classes.infoPanelValue}>{queryViewLabel}</div>
              </div>
              <div className={classes.infoPanelItem}>
                <div className={classes.infoPanelLabel}>
                  {t("jempnt_jcrQuery.infoPanel.contentType")}
                </div>
                <div className={classes.infoPanelValue}>{contentTypeLabel}</div>
              </div>
              <div className={classes.infoPanelItem}>
                <div className={classes.infoPanelLabel}>
                  {t("jempnt_jcrQuery.infoPanel.itemCount")}
                </div>
                <div className={classes.infoPanelValue}>
                  {itemCount}{" "}
                  {itemCount === 1
                    ? t("jempnt_jcrQuery.infoPanel.item")
                    : t("jempnt_jcrQuery.infoPanel.items")}
                </div>
              </div>
              <div className={classes.infoPanelItem}>
                <div className={classes.infoPanelLabel}>{t("jempnt_jcrQuery.infoPanel.view")}</div>
                <div className={classes.infoPanelValue}>{viewLabel}</div>
              </div>
            </div>
          </div>
        )}

        {title && <h2 className={classes.title}>{title}</h2>}

        {queryContent && queryContent.length > 0 ? (
          isAuthoring ? (
            // Edit mode: Show grid layout with remaining count card
            <div className={classes.editModeGrid}>
              {visibleItems.map((node) => (
                <div
                  key={(node as JCRNodeWrapper).getIdentifier()}
                  className={classes.editModeCard}
                >
                  <Render node={node as JCRNodeWrapper} view={subNodeView || "card"} readOnly />
                </div>
              ))}
              {remainingCount > 0 && (
                <div className={classes.remainingCard}>
                  <div className={classes.remainingContent}>
                    <span className={classes.remainingCount}>+{remainingCount}</span>
                    <span className={classes.remainingText}>
                      {remainingCount === 1
                        ? t("jempnt_jcrQuery.moreItem")
                        : t("jempnt_jcrQuery.moreItems")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Live mode: Show carousel
            <div className={classes.carouselContainer}>
              <div className={classes.carousel} data-carousel-id={carouselId}>
                <div className={classes.carouselTrack} data-carousel-track>
                  {queryContent.map((node) => (
                    <div
                      key={(node as JCRNodeWrapper).getIdentifier()}
                      className={classes.carouselSlide}
                      data-carousel-slide
                    >
                      <Render node={node as JCRNodeWrapper} view={subNodeView || "card"} readOnly />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Controls */}
              <button
                className={`${classes.carouselButton} ${classes.carouselButtonPrev}`}
                data-carousel-prev={carouselId}
                aria-label={t("jemp.label.previous")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className={`${classes.carouselButton} ${classes.carouselButtonNext}`}
                data-carousel-next={carouselId}
                aria-label={t("jemp.label.next")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Indicators */}
              <div className={classes.carouselIndicators} data-carousel-indicators={carouselId}>
                {queryContent.map((node, index) => (
                  <button
                    key={(node as JCRNodeWrapper).getIdentifier()}
                    className={classes.indicator}
                    data-carousel-indicator={carouselId}
                    data-index={index}
                    data-active={index === 0 ? "true" : undefined}
                    aria-label={`${t("jemp.label.goToSlide")} ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )
        ) : (
          <div className={classes.noResults}>{noResultText || t("jempnt_jcrQuery.noResults")}</div>
        )}
      </div>
    );
  },
);
