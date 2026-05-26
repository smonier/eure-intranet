import type { JCRNodeWrapper } from "org.jahia.services.content";

interface TagsMetaProps {
  tags?: string[];
  categories?: JCRNodeWrapper | JCRNodeWrapper[];
}

/**
 * Renders a row of category chips + tag pills for fullPage views.
 * Returns null when there is nothing to show.
 */
export function TagsMeta({ tags, categories }: TagsMetaProps) {
  // Normalise categories to an array of display names (safe against GraalVM proxy quirks)
  const categoryNames: string[] = [];
  if (categories) {
    const arr = Array.isArray(categories) ? categories : [categories];
    for (const cat of arr) {
      if (!cat) continue;
      try {
        const name =
          typeof (cat as JCRNodeWrapper).getDisplayableName === "function"
            ? (cat as JCRNodeWrapper).getDisplayableName()
            : null;
        if (name) categoryNames.push(name);
      } catch {
        // skip unreachable node
      }
    }
  }

  const validTags = tags?.filter((t) => t && t.trim()) ?? [];

  if (categoryNames.length === 0 && validTags.length === 0) return null;

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "2rem",
      paddingTop: "1.5rem",
      borderTop: "1px solid #e5e7eb",
    }}>
      {categoryNames.map((name) => (
        <span key={name} style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.3rem 0.85rem",
          borderRadius: "4px",
          fontSize: "0.78rem",
          fontWeight: 600,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          background: "var(--eui-color-primary, #1C3F6E)",
          color: "#fff",
        }}>
          <span aria-hidden="true" style={{ fontSize: "0.7rem" }}>📂</span>
          {name}
        </span>
      ))}
      {validTags.map((tag) => (
        <span key={tag} style={{
          display: "inline-block",
          padding: "0.3rem 0.85rem",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: 500,
          background: "rgba(28, 63, 110, 0.08)",
          color: "var(--eui-color-primary, #1C3F6E)",
          border: "1px solid rgba(28, 63, 110, 0.2)",
        }}>
          #{tag}
        </span>
      ))}
    </div>
  );
}
