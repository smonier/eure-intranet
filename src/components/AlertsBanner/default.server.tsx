import { jahiaComponent, AddResources } from "@jahia/javascript-modules-library";
import { t } from "i18next";
import type { Props } from "./types.js";
import classes from "./component.module.css";

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:alertBanner",
    name: "default",
    displayName: "Alert Banner",
  },
  (rawProps) => {
    const props = rawProps as Props;
    const message = props["eui:message"];
    const level = props["eui:level"];
    const expiry = props["eui:expiryDate"];
    const alertId = props["jcr:uuid"];

    if (!message) return <></>;
    if (expiry && new Date(expiry) < new Date()) return <></>;

    const lvl = (level || "info").toLowerCase();

    // Check if already dismissed in session
    const checkDismissedScript = `
      (function() {
        const alertId = '${alertId}';
        if (sessionStorage.getItem('alert-dismissed-' + alertId) === 'true') {
          const banner = document.currentScript.parentElement;
          banner.parentNode.removeChild(banner);
        }
      })();
    `;

    const closeScript = `
      (function() {
        const script = document.currentScript;
        const banner = script.parentElement;
        const btn = banner.querySelector('[data-alert-close="${alertId}"]');
        if (btn) {
          btn.onclick = function(e) {
            e.preventDefault();
            const alertId = '${alertId}';
            sessionStorage.setItem('alert-dismissed-' + alertId, 'true');
            if (banner) {
              banner.style.opacity = '0';
              banner.style.transform = 'translateX(20px)';
              setTimeout(function() {
                banner.parentNode.removeChild(banner);
              }, 300);
            }
          };
        }
      })();
    `;

    return (
      <div className={`${classes.banner} ${classes[`banner--${lvl}`]}`} data-alert-id={alertId}>
        <script dangerouslySetInnerHTML={{ __html: checkDismissedScript }} />
        <span className={classes.message}>{message}</span>
        <button
          className={classes.closeButton}
          data-alert-close={alertId}
          aria-label={t("alertsBanner.closeAlertAria", "Close alert")}
          type="button"
        >
          ×
        </button>
        <script dangerouslySetInnerHTML={{ __html: closeScript }} />
      </div>
    );
  },
);
