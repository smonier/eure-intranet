import {
  jahiaComponent,
  AddResources,
  buildModuleFileUrl,
} from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import classes from "./component.module.css";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:searchBox",
    displayName: "Search Box",
  },
  ({ node }: { node?: JCRNodeWrapper }) => {
    const placeholder = node?.hasProperty("eui:placeholder")
      ? node.getProperty("eui:placeholder").getString()
      : t("search.placeholder");
    const formAriaLabel = t("search.formAriaLabel", "Site search");
    const submitLabel = t("search.submitLabel", "Search");

    return (
      <>
        <AddResources
          type="javascript"
          resources={buildModuleFileUrl("dist/client/components/SearchBox/island.client.js")}
        />
        <div className={classes.searchBox} data-search-box>
          <form className={classes.searchForm} role="search" aria-label={formAriaLabel}>
            <input
              type="search"
              name="q"
              className={classes.searchInput}
              placeholder={placeholder}
              aria-label={placeholder}
              autoComplete="off"
            />
            <button
              type="submit"
              className={classes.searchButton}
              aria-label={submitLabel}
              title={submitLabel}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={classes.searchIcon}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>
        </div>
      </>
    );
  },
);
