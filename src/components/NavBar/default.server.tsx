import {
  buildNodeUrl,
  getChildNodes,
  jahiaComponent,
  AddResources,
  buildModuleFileUrl,
} from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { RenderContext } from "org.jahia.services.render";
import { HomeIcon } from "~/components/shared";
import { t } from "i18next";
import classes from "./component.module.css";
import { LanguageSwitcher } from "./LanguageSwitcher";

/** Get all child pages of a node. */
const getChildPages = (node: JCRNodeWrapper) =>
  getChildNodes(node, -1, 0, (node) => node.isNodeType("jnt:page"));

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:navBar",
    displayName: "NavBar",
  },
  (_, { renderContext, mainNode }) => {
    const site = (renderContext as RenderContext).getSite();
    const allSitePages = getChildPages(site);

    // Level 0: Home page (first page under site)
    const homePage = allSitePages.length > 0 ? allSitePages[0] : site;
    const homeUrl = buildNodeUrl(homePage);
    const isHomePage = mainNode === homePage;

    // Level 1: Main navigation - children of the home page
    const level1Pages = getChildPages(homePage);

    const navAriaLabel = t("nav.mainAriaLabel", "Main navigation");
    const homeText = t("nav.homeLabel", "Home");
    const homeAriaLabel = t("nav.homeAriaLabel", "Home");
    const toggleLabel = t("nav.toggleMenu", "Toggle navigation menu");

    return (
      <>
        <AddResources
          type="javascript"
          resources={buildModuleFileUrl("dist/client/components/NavBar/menu.client.ts.js")}
        />
        <nav className={classes.nav} role="navigation" aria-label={navAriaLabel}>
          <div className={classes.navContainer}>
            {/* Home Link (Level 0) - Always visible on the left */}
            <a
              href={homeUrl}
              className={classes.homeLink}
              aria-label={homeAriaLabel}
              aria-current={isHomePage ? "page" : undefined}
            >
              <HomeIcon width="20px" height="20px" />
              <span className={classes.homeLinkText}>{homeText}</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className={classes.menuToggle}
              aria-label={toggleLabel}
              aria-expanded="false"
              type="button"
              data-nav-toggle="true"
            >
              <span className={classes.menuIcon}></span>
              <span className={classes.menuIcon}></span>
              <span className={classes.menuIcon}></span>
            </button>

            {/* Navigation Menu */}
            <ul className={classes.navList}>
              {/* Level 1 Pages - Horizontal Navigation */}
              {level1Pages.map((page) => {
                const level2Pages = getChildPages(page); // Sub-pages (vertical dropdowns)
                const hasSubPages = level2Pages.length > 0;
                const isActive = page === mainNode || level2Pages.some((sub) => sub === mainNode);

                return (
                  <li
                    key={page.getPath()}
                    className={`${classes.navItem} ${hasSubPages ? classes.hasDropdown : ""}`}
                  >
                    <a
                      href={buildNodeUrl(page)}
                      className={classes.navLink}
                      aria-current={page === mainNode ? "page" : undefined}
                      aria-haspopup={hasSubPages ? "true" : undefined}
                    >
                      {page.getProperty("jcr:title").getString()}
                      {hasSubPages && <span className={classes.dropdownIcon}>▼</span>}
                    </a>

                    {hasSubPages && (
                      <ul className={classes.dropdown}>
                        {/* Level 2 Pages - Vertical Dropdown */}
                        {level2Pages.map((subPage) => (
                          <li key={subPage.getPath()} className={classes.dropdownItem}>
                            <a
                              href={buildNodeUrl(subPage)}
                              className={classes.dropdownLink}
                              aria-current={subPage === mainNode ? "page" : undefined}
                            >
                              {subPage.getProperty("jcr:title").getString()}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              <LanguageSwitcher />
            </ul>
          </div>
        </nav>
      </>
    );
  },
);
