import { Area, jahiaComponent, Island } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { Props } from "./types.js";
import classes from "./component.module.css";
import ContributionModalIsland from "./island.client";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:contributionModal",
    name: "default",
    displayName: "Contribution Modal",
  },
  (rawProps: Props, { renderContext, currentNode }) => {
    const { "jcr:title": title, "eui:description": description, "eui:buttonLabel": buttonLabel, "jcr:uuid": uuid } =
      rawProps;

    const modalId = `contribution-modal-${uuid ?? Math.random().toString(36).slice(2)}`;
    const ctaLabel = buttonLabel || t("jemp.label.open", "Open");
    const closeLabel = t("jemp.label.close", "Close");
    const emptyLabel = t("jemp.label.dropContent", "Drop existing content here");

    const context = renderContext as RenderContext;
    const node = currentNode as JCRNodeWrapper;
    const modalArea = node.hasNode("modalContent") ? node.getNode("modalContent") : null;
    const modalChildren = modalArea ? Array.from(modalArea.getNodes()) : [];
    const isEditMode = context.isEditMode();
    const hasChildren = modalChildren.length > 0;

    return (
      <section className={classes.root}>
        {title && <h2 className={classes.title}>{title}</h2>}
        {description && <div className={classes.description} dangerouslySetInnerHTML={{ __html: description }} />}
        <button type="button" className={classes.cta} data-modal-open={modalId}>
          {ctaLabel}
        </button>

        <div className={classes.overlay} data-modal-overlay={modalId} aria-hidden="true">
          <div className={classes.modal} role="dialog" aria-modal="true" aria-labelledby={`${modalId}-title`}>
            <div className={classes.modalHeader}>
              <h3 id={`${modalId}-title`} className={classes.modalTitle}>
                {title || ctaLabel}
              </h3>
              <button type="button" className={classes.close} data-modal-close={modalId} aria-label={closeLabel}>
                ×
              </button>
            </div>
            <div className={classes.modalBody}>
              {/* {!hasChildren && isEditMode && <div className={classes.emptyState}>{emptyLabel}</div>} */}
              <Area name="modalContent" nodeType="jnt:contentList" />
            </div>
          </div>
        </div>

        <Island component={ContributionModalIsland} props={{ modalId }} />
      </section>
    );
  },
);
