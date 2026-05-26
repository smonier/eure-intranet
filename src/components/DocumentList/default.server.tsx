import { jahiaComponent, RenderChildren, buildNodeUrl } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { DocumentCardProps, DocumentListProps, FileType, DocSource } from "./types.js";
import classes from "./component.module.css";

const FILE_ICONS: Record<FileType, string> = {
  pdf:   "📄",
  docx:  "📝",
  xlsx:  "📊",
  pptx:  "📋",
  zip:   "🗜️",
  other: "📁",
};

const FILE_COLORS: Record<FileType, string> = {
  pdf:   "#dc2626",
  docx:  "#2563eb",
  xlsx:  "#16a34a",
  pptx:  "#d97706",
  zip:   "#7c3aed",
  other: "#64748b",
};

const SOURCE_LABELS: Record<DocSource, { label: string; color: string }> = {
  local:       { label: "Intranet",   color: "var(--eui-color-primary)" },
  sharepoint:  { label: "SharePoint", color: "#038387" },
  ged:         { label: "GED",        color: "var(--eui-color-secondary)" },
};

function resolveHref(props: DocumentCardProps): string | null {
  const { "seu:linkType": lt, "seu:externalLink": ext, "seu:internalLink": int } = props;
  if (lt === "externalLink" && typeof ext === "string") return ext;
  if (lt === "internalLink" && int) {
    if (typeof int === "string") return int;
    if (typeof int === "object" && int !== null && "getPath" in int) return buildNodeUrl(int as JCRNodeWrapper);
  }
  return null;
}

jahiaComponent(
  { componentType: "view", nodeType: "euint:documentCard", name: "default", displayName: "Document Card" },
  (props: DocumentCardProps) => {
    const title       = props["jcr:title"];
    const description = props["eui:description"];
    const fileType    = props["eui:fileType"] ?? "other";
    const source      = props["eui:source"] ?? "local";
    const direction   = props["eui:direction"];
    const rawDate     = props["eui:publishedDate"];
    const href        = resolveHref(props);
    const target      = props["seu:linkTarget"] && props["seu:linkTarget"] !== "_self" ? props["seu:linkTarget"] : undefined;

    const dateStr = rawDate
      ? new Date(rawDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
      : null;

    const src = SOURCE_LABELS[source];

    const inner = (
      <div className={classes.card}>
        <div className={classes.fileIcon} style={{ color: FILE_COLORS[fileType] }}>
          {FILE_ICONS[fileType]}
          <span className={classes.fileType}>{fileType.toUpperCase()}</span>
        </div>
        <div className={classes.body}>
          <div className={classes.meta}>
            <span className={classes.sourceBadge} style={{ background: src.color }}>{src.label}</span>
            {direction && <span className={classes.direction}>{direction}</span>}
            {dateStr && <span className={classes.date}>{dateStr}</span>}
          </div>
          <p className={classes.title}>{title}</p>
          {description && <p className={classes.description}>{description}</p>}
        </div>
        {href && <span className={classes.downloadIcon} aria-hidden="true">⬇</span>}
      </div>
    );

    if (href) {
      return (
        <a href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} className={classes.link}>
          {inner}
        </a>
      );
    }
    return <div className={classes.link}>{inner}</div>;
  },
);

jahiaComponent(
  { componentType: "view", nodeType: "euint:documentList", name: "default", displayName: "Document List" },
  ({ "jcr:title": title }: DocumentListProps) => (
    <section className={classes.list}>
      {title && (
        <h2 className={classes.listHeading}>
          <span className={classes.listHeadingAccent}>📂</span> {title}
        </h2>
      )}
      <div className={classes.grid}>
        <RenderChildren />
      </div>
    </section>
  ),
);
