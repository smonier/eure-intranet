/**
 * Client-side search box functionality
 * Handles form submission and redirects to search results page
 */

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector("[data-search-box]");

    if (searchBox) {
      const form = searchBox.querySelector("form");

      if (form) {
        form.addEventListener("submit", (event) => {
          event.preventDefault();

          const input = form.querySelector('input[name="q"]') as HTMLInputElement;
          const query = input?.value.trim();

          if (query) {
            // Use data-search-action set by the server view, fallback to relative path
            const actionUrl = (form as HTMLFormElement).dataset.searchAction ?? "/search";
            window.location.href = `${actionUrl}?q=${encodeURIComponent(query)}`;
          }
        });
      }
    }
  });
}
