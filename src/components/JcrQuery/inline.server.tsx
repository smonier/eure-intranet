import {
  getNodesByJCRQuery,
  jahiaComponent,
  Render,
  server,
} from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { RenderContext } from "org.jahia.services.render";
import { t } from "i18next";
import { buildQuery, getContentTypeLabel } from "./utils";
import type { JcrQueryProps } from "./types";
import alert from "~/templates/css/alert.module.css";
import { HeadingSection } from "~/components/shared";
import infoClasses from "./default.module.css";

jahiaComponent(
  {
    nodeType: "euint:jcrQuery",
    name: "inline",
    displayName: "Inline Result",
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
    const isEditMode = renderContext.isEditMode();

    return (
      <>
        {isEditMode && (
          <div className={infoClasses.infoPanel}>
            <div className={infoClasses.infoPanelTitle}>{t("jempnt_jcrQuery.infoPanel.title")}</div>
            <div className={infoClasses.infoPanelContent}>
              <div className={infoClasses.infoPanelItem}>
                <div className={infoClasses.infoPanelLabel}>
                  {t("jempnt_jcrQuery.infoPanel.queryView")}
                </div>
                <div className={infoClasses.infoPanelValue}>{queryViewLabel}</div>
              </div>
              <div className={infoClasses.infoPanelItem}>
                <div className={infoClasses.infoPanelLabel}>
                  {t("jempnt_jcrQuery.infoPanel.contentType")}
                </div>
                <div className={infoClasses.infoPanelValue}>{contentTypeLabel}</div>
              </div>
              <div className={infoClasses.infoPanelItem}>
                <div className={infoClasses.infoPanelLabel}>
                  {t("jempnt_jcrQuery.infoPanel.itemCount")}
                </div>
                <div className={infoClasses.infoPanelValue}>
                  {itemCount}{" "}
                  {itemCount === 1
                    ? t("jempnt_jcrQuery.infoPanel.item")
                    : t("jempnt_jcrQuery.infoPanel.items")}
                </div>
              </div>
              <div className={infoClasses.infoPanelItem}>
                <div className={infoClasses.infoPanelLabel}>
                  {t("jempnt_jcrQuery.infoPanel.view")}
                </div>
                <div className={infoClasses.infoPanelValue}>{viewLabel}</div>
              </div>
            </div>
          </div>
        )}

        {title && <HeadingSection title={title} />}

        {isEditMode && warn && (
          <div className={alert.warning} role="alert">
            {warn}
          </div>
        )}

        {queryContent &&
          queryContent.map((node) => (
            <Render
              key={node.getIdentifier()}
              node={node as JCRNodeWrapper}
              view={subNodeView || "default"}
              readOnly
            />
          ))}
        {(!queryContent || queryContent.length === 0) && isEditMode && (
          <div className={alert.dark} role="alert">
            {t(noResultText || "query.noResult")}
          </div>
        )}
      </>
    );
  },
);
