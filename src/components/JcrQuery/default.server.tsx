import {
  getNodesByJCRQuery,
  jahiaComponent,
  Render,
  server,
} from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { RenderContext } from "org.jahia.services.render";
import classes from "./default.module.css";
import alert from "~/templates/css/alert.module.css";
import { t } from "i18next";
import { buildQuery, getContentTypeLabel } from "./utils";
import type { JcrQueryProps } from "./types";
import { Col, HeadingSection, Row } from "~/components/shared";

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
    const itemCount = queryContent ? queryContent.length : 0;
    const contentTypeLabel = getContentTypeLabel(type);
    const viewLabel = subNodeView || t("jempnt_jcrQuery.infoPanel.defaultView");
    const queryViewLabel = queryView || t("jempnt_jcrQuery.infoPanel.defaultView");

    return (
      <div className={classes.root}>
        {/* Info panel in edit mode */}
        {renderContext.isEditMode() && (
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

        {title && queryContent && queryContent.length > 0 && <HeadingSection title={title} />}
        {renderContext.isEditMode() && warn && (
          <div className={alert.warning} role="alert">
            {warn}
          </div>
        )}

        {queryContent && queryContent.length > 0 && (
          <Row className={classes.main}>
            {queryContent.map((node) => {
              return (
                <Col key={node.getIdentifier()}>
                  <Render node={node as JCRNodeWrapper} view={subNodeView || "default"} readOnly />
                </Col>
              );
            })}
          </Row>
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
