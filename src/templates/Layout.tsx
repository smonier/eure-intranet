import type { JSX, ReactNode } from "react";
import {
  AbsoluteArea,
  AddResources,
  buildModuleFileUrl,
  getNodeProps,
  useServerContext,
} from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";

import "modern-normalize/modern-normalize.css";
import "./global.css";

// ============================================================================
// Types
// ============================================================================

interface LayoutProps {
  title?: string;
  head?: ReactNode;
  children: ReactNode;
}

interface HtmlHeadProps {
  title?: string;
  children?: ReactNode;
}

interface SeoMetaTagsProps {
  "jcr:title"?: string;
  "jcr:description"?: string;
  "openGraphImage"?: JCRNodeWrapper;
  "seoKeywords"?: string[];
}

interface OpenGraphImageSizes {
  "j:width"?: number;
  "j:height"?: number;
}

// ============================================================================
// Main Layout Component
// ============================================================================

/**
 * Main layout component that wraps the entire page
 * Provides HTML structure, head elements, and footer area
 */
export const Layout = ({ title, head, children }: LayoutProps): JSX.Element => {
  const { currentResource, renderContext } = useServerContext();
  const lang = currentResource?.getLocale().getLanguage() ?? "en";
  const site = renderContext?.getSite();
  const footerParent = site && typeof site.getHome === "function" ? site.getHome() : site;

  return (
    <html lang={lang}>
      <HtmlHead title={title}>{head}</HtmlHead>
      <body>
        {children}
        {site && <AbsoluteArea name="footer" parent={footerParent} nodeType="euint:footer" />}
      </body>
    </html>
  );
};

// ============================================================================
// HTML Head Component
// ============================================================================

/**
 * HTML head section with basic meta tags, SEO tags, and stylesheets
 */
const HtmlHead = ({ title, children }: HtmlHeadProps): JSX.Element => (
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <SeoMetaTags fallbackTitle={title} />
    <AddResources type="css" resources={buildModuleFileUrl("dist/assets/style.css")} />
    {children}
  </head>
);

// ============================================================================
// SEO Meta Tags Component
// ============================================================================

/**
 * Generates SEO and Open Graph meta tags based on the current node properties
 * Includes title, description, keywords, and Open Graph image
 */
const SeoMetaTags = ({ fallbackTitle }: { fallbackTitle?: string }): JSX.Element | null => {
  const { currentNode, currentResource, renderContext } = useServerContext();

  // Early return if required context is missing
  if (!currentNode || !currentResource || !renderContext) {
    return fallbackTitle ? <title>{fallbackTitle}</title> : null;
  }

  // Check if node type supports SEO meta tags
  const isDisplayableNodeType =
    currentNode.isNodeType("jnt:page") || currentNode.isNodeType("jmix:mainResource");

  if (!isDisplayableNodeType) {
    return fallbackTitle ? <title>{fallbackTitle}</title> : null;
  }

  // Extract SEO properties from node
  const {
    "jcr:title": seoTitle,
    "jcr:description": seoDescription,
    openGraphImage,
    seoKeywords,
  } = getNodeProps(currentNode, [
    "jcr:title",
    "jcr:description",
    "openGraphImage",
    "seoKeywords",
  ]) as SeoMetaTagsProps;

  // Get contextual data
  const locale = currentResource.getLocale().getLanguage();
  const request = renderContext.getRequest();
  const site = renderContext.getSite();
  const absOgImageUrl = openGraphImage?.getAbsoluteUrl(request);

  // Get Open Graph image dimensions
  const openGraphImageSizes = openGraphImage
    ? (getNodeProps(openGraphImage, ["j:width", "j:height"]) as OpenGraphImageSizes)
    : {};

  return (
    <>
      {/* Title Tags */}
      {seoTitle ? (
        <>
          <title>{seoTitle}</title>
          <meta property="og:title" content={seoTitle} />
        </>
      ) : (
        fallbackTitle && <title>{fallbackTitle}</title>
      )}

      {/* Open Graph Basic Tags */}
      <meta property="og:locale" content={locale} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentNode.getAbsoluteUrl(request)} />
      {site && <meta property="og:site_name" content={site.getTitle()} />}

      {/* Description Tags */}
      {seoDescription && (
        <>
          <meta name="description" content={seoDescription} />
          <meta property="og:description" content={seoDescription} />
        </>
      )}

      {/* Keywords Tag */}
      {Boolean(seoKeywords?.length) && <meta name="keywords" content={seoKeywords!.join(",")} />}

      {/* Open Graph Image Tags */}
      {absOgImageUrl && (
        <>
          <meta property="og:image" content={absOgImageUrl} />
          {openGraphImageSizes["j:width"] && (
            <meta property="og:image:width" content={`${openGraphImageSizes["j:width"]}px`} />
          )}
          {openGraphImageSizes["j:height"] && (
            <meta property="og:image:height" content={`${openGraphImageSizes["j:height"]}px`} />
          )}
        </>
      )}
    </>
  );
};
