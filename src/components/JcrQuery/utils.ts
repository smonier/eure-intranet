import type { JcrQueryProps } from "./types";
import type { RenderContext } from "org.jahia.services.render";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { TFunction } from "i18next";
import { server } from "@jahia/javascript-modules-library";

interface BuildQueryProps {
  jempQuery: JcrQueryProps;
  t: TFunction;
  server: typeof server;
  currentNode: JCRNodeWrapper;
  renderContext: RenderContext;
}

export const buildQuery = ({
  jempQuery,
  t,
  server,
  currentNode,
  renderContext,
}: BuildQueryProps) => {
  let warn: string | null = null;
  const asContent = "content";
  // Const descendantPath = jempQuery.startNode?.getPath() || `/sites/${currentNode.getResolveSite().getSiteKey()}`;

  const descendantPath =
    jempQuery.startNode?.getPath() || `${currentNode.getResolveSite().getPath()}`;

  /**
   * build Filter based on category
   */
  const filter =
    jempQuery.filter?.reduce((condition, categoryNode, index) => {
      // If category is deleted, the filter contains "undefined" for the deleted category
      if (!categoryNode) {
        warn = t("query.catIsMissing", { queryName: jempQuery["jcr:title"] });
        return condition;
      }

      return `${condition} ${index === 0 ? "" : "OR"} ${asContent}.[j:defaultCategory] = '${categoryNode.getIdentifier()}'`;
    }, "") || "";
  const queryFilter = filter.trim().length > 0 ? `AND (${filter})` : "";

  /**
   * build Filter based on excludeNodes
   */
  const excludeNodes =
    jempQuery.excludeNodes?.reduce((condition, excludeNode, index) => {
      // If excludeNode is deleted, the filter contains "undefined" for the deleted category
      if (!excludeNode) {
        warn = t("query.excludeIsMissing", { queryName: jempQuery["jcr:title"] });
        return condition;
      }

      const translationNode = excludeNode.getNode(
        `j:translation_${renderContext.getMainResourceLocale().getLanguage()}`,
      );
      const extraLanguageNode = translationNode
        ? `AND ${asContent}.[jcr:uuid] <> '${translationNode.getIdentifier()}'`
        : "";
      return `${condition} ${index === 0 ? "" : "OR"} (${asContent}.[jcr:uuid] <> '${excludeNode.getIdentifier()}' ${extraLanguageNode})`;
    }, "") || "";
  const queryExcludeNodes = excludeNodes.trim().length > 0 ? `AND (${excludeNodes})` : "";

  const jcrQuery = `SELECT *
                      FROM [${jempQuery.type}] AS ${asContent}
                      WHERE ISDESCENDANTNODE('${descendantPath}') ${queryFilter} ${queryExcludeNodes}
                      ORDER BY ${asContent}.[${jempQuery.criteria}] ${jempQuery.sortDirection}`;

  server.render.addCacheDependency(
    { flushOnPathMatchingRegexp: `${descendantPath}/.*` },
    renderContext,
  );
  return { jcrQuery, warn };
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  "euint:newsArticle": "News Articles",
  "euint:eventCard": "Events",
  "euint:policyDetail": "Policies",
  "euint:knowledgeBaseArticle": "Knowledge Base Articles",
  "euint:alertsBanner": "Alerts",
  "euint:quickLinks": "Quick Links",
};

export const getContentTypeLabel = (type: string): string =>
  CONTENT_TYPE_LABELS[type] || type;
