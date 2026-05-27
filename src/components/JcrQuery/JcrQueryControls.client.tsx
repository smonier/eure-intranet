import { useEffect, useRef, useState } from "react";
import classes from "./controls.module.css";

export interface CategoryMeta {
  id: string;
  name: string;
}

export interface JcrQueryControlsProps {
  /** Unique ID matching data-qgrid on the items wrapper */
  queryId: string;
  /** All distinct categories found across results (may be empty) */
  categories: CategoryMeta[];
  /** Show "load more" button — items beyond pageSize are hidden initially */
  loadMore: boolean;
  /** Show category filter chips */
  categoryFilter: boolean;
  /** Number of items shown before "load more" (default 6) */
  pageSize?: number;
  /** Total number of items */
  total: number;
}

export default function JcrQueryControls({
  queryId,
  categories,
  loadMore,
  categoryFilter,
  pageSize = 6,
  total,
}: JcrQueryControlsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(loadMore ? pageSize : total);
  // track how many match the active filter
  const [filteredTotal, setFilteredTotal] = useState(total);

  // Apply visibility to DOM items whenever activeCategory or visibleCount changes
  useEffect(() => {
    const grid = document.querySelector(`[data-qgrid="${queryId}"]`);
    if (!grid) return;

    const items = Array.from(
      grid.querySelectorAll<HTMLElement>(`[data-qitem="${queryId}"]`)
    );

    // 1. Filter pass — show/hide by category
    let matchIdx = 0;
    items.forEach((item) => {
      const raw = item.getAttribute("data-categories") ?? "";
      const itemCats = raw ? raw.split(",") : [];
      const matchesCat =
        !activeCategory || itemCats.includes(activeCategory);

      if (matchesCat) {
        item.setAttribute("data-cat-visible", "true");
        matchIdx++;
      } else {
        item.setAttribute("data-cat-visible", "false");
      }
    });

    setFilteredTotal(matchIdx);

    // 2. Load-more pass — apply within category-visible items only
    let shownSoFar = 0;
    items.forEach((item) => {
      if (item.getAttribute("data-cat-visible") === "false") {
        item.setAttribute("data-lm-visible", "false");
        return;
      }
      shownSoFar++;
      item.setAttribute(
        "data-lm-visible",
        loadMore && shownSoFar > visibleCount ? "false" : "true"
      );
    });
  }, [activeCategory, visibleCount, queryId, loadMore]);

  // When category changes, reset the visible count
  const handleCategoryClick = (catId: string | null) => {
    setActiveCategory(catId);
    setVisibleCount(loadMore ? pageSize : total);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + pageSize);
  };

  const showLoadMore =
    loadMore && filteredTotal > visibleCount;

  return (
    <>
      {/* ── Category filter chips ── */}
      {categoryFilter && categories.length > 0 && (
        <div className={classes.filterBar} role="group" aria-label="Filtrer par catégorie">
          <button
            type="button"
            className={`${classes.chip} ${activeCategory === null ? classes.chipActive : ""}`}
            onClick={() => handleCategoryClick(null)}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${classes.chip} ${activeCategory === cat.id ? classes.chipActive : ""}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Load more button ── */}
      {showLoadMore && (
        <div className={classes.loadMoreWrapper}>
          <button
            type="button"
            className={classes.loadMoreBtn}
            onClick={handleLoadMore}
          >
            Voir plus
            <span className={classes.loadMoreCount}>
              ({Math.min(pageSize, filteredTotal - visibleCount)} de plus)
            </span>
          </button>
        </div>
      )}
    </>
  );
}
