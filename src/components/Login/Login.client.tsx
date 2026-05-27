import clsx from "clsx";
import { t } from "i18next";
import { type MouseEvent, useEffect, useMemo, useState } from "react";
import LoginFormClient from "./LoginForm.client";
import type { JahiaUrlsProps, LoginPersonaProps } from "./types";
import classes from "./Login.client.module.css";
import alert from "~/templates/css/alert.module.css";

interface LoginClientProps {
  isLoggedIn: boolean;
  userHydrated?: string;
  userFirstName?: string;
  userLastName?: string;
  urls: JahiaUrlsProps;
  mode: string;
  nodePath: string;
  isShowRememberMe: boolean;
  siteKey?: string;
  persona: LoginPersonaProps[];
  displayMode?: "modal" | "inline";
}

const LoginClient = ({
  isLoggedIn,
  userHydrated,
  userFirstName,
  userLastName,
  urls,
  mode,
  nodePath,
  isShowRememberMe,
  siteKey,
  persona,
  displayMode = "modal",
}: LoginClientProps) => {
  const isInline = displayMode === "inline";
  const [user, setUser] = useState(userHydrated);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [displayFirstName, setDisplayFirstName] = useState(userFirstName);
  const [displayLastName, setDisplayLastName] = useState(userLastName);

  // Resolve real display name once we know we're logged in
  useEffect(() => {
    if (!loggedIn || !user) return;
    if (displayFirstName || displayLastName) return; // already set from server props

    // 1. Fast path: username matches one of the configured personas — use its full name
    const matchedPersona = personaList.find((p) => p.username === user);
    if (matchedPersona?.userinfo?.fullname) {
      const parts = matchedPersona.userinfo.fullname.trim().split(/\s+/);
      setDisplayFirstName(parts[0]);
      if (parts.length > 1) setDisplayLastName(parts.slice(1).join(" "));
      return;
    }

    // 2. Fallback: ask GraphQL with the current session cookie.
    //    Note: regular users cannot read jnt:user nodes, so this only succeeds for
    //    privileged accounts (admin, root). Safe to fire — will silently fall back to username.
    fetch("/modules/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        query: `{ jcr { nodesByQuery(query: "SELECT * FROM [jnt:user] WHERE NAME() = '${user}'", queryLanguage: SQL2) { nodes { properties(names: ["j:firstName", "j:lastName"]) { name value } } } } }`,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        const nodes = data?.data?.jcr?.nodesByQuery?.nodes ?? [];
        if (nodes.length > 0) {
          const map: Record<string, string> = Object.fromEntries(
            (nodes[0].properties as { name: string; value: string }[]).map((p) => [p.name, p.value]),
          );
          if (map["j:firstName"]) setDisplayFirstName(map["j:firstName"]);
          if (map["j:lastName"]) setDisplayLastName(map["j:lastName"]);
        }
      })
      .catch(() => {/* stay with username as display name */});
  }, [loggedIn, user]);

  const displayName =
    displayFirstName || displayLastName
      ? `${displayFirstName ?? ""} ${displayLastName ?? ""}`.trim()
      : user;
  const [isOpen, setIsOpen] = useState(isInline);

  const personaList = useMemo(() => persona ?? [], [persona]);

  useEffect(() => {
    if (isInline) {
      return;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, isInline]);

  const showModal = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isInline) {
      return;
    }
    event.preventDefault();
    setIsOpen(true);
  };

  const logout = async () => {
    await fetch(urls.logoutUrl);
    if (typeof window !== "undefined") {
      // After logout, redirect to the login page (home)
      window.location.href = "/sites/eureintranet/home.html";
    } else {
      setLoggedIn(false);
    }
  };

  const resolveRedirectUrl = (_username?: string): string => {
    // After login, send all personas to the dashboard (ProfileDashboard page).
    // The dashboard reads the logged-in username server-side and activates the correct profile area.
    return "/sites/eureintranet/home/tableau-de-bord.html";
  };

  const handleLoggedIn = (username: string) => {
    setLoggedIn(true);
    setIsOpen(false);
    if (typeof window !== "undefined") {
      window.location.href = resolveRedirectUrl(username);
    }
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isInline) {
      return;
    }
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

  if (mode === "edit") {
    return (
      <div className={clsx(alert.dark, classes.fs6)} role="alert">
        {t("form.login.editModeWarning")}
      </div>
    );
  }

  return (
    <>
      {loggedIn ? (
        <div className={classes.loggedCard}>
          <div className={classes.loggedHeader}>
            <span className={classes.loggedBadge}>{t("form.login.loggedIn", "Signed in")}</span>
            <h3 className={classes.loggedName}>{displayName}</h3>
            <p className={classes.loggedSubtitle}>{t("form.login.manageAccess", "You now have access to the employee portal experience.")}</p>
          </div>
          <div className={classes.loggedActions}>
            <button type="button" className={classes.logoutBtn} onClick={logout}>
              {t("form.login.logout")}
            </button>
          </div>
        </div>
      ) : isInline ? (
        <>
          <div className={classes.inlineContainer}>
            <LoginFormClient
              loginUrl={urls.loginUrl}
              isShowRememberMe={isShowRememberMe}
              setUser={setUser}
              handleLoggedIn={handleLoggedIn}
              siteKey={siteKey}
              persona={personaList}
            />
          </div>
        </>
      ) : (
        <>
          <h5 className={classes.capitalize}>{t("footer.backOffice")}</h5>
          <p>
            <a href={urls.loginUrl} className={classes.capitalize} onClick={showModal}>
              {t("form.login.login")}
            </a>
          </p>
        </>
      )}

      {!isInline && (
        <div
          className={classes.modalOverlay}
          data-open={isOpen ? "true" : undefined}
          aria-hidden={isOpen ? undefined : "true"}
          onClick={handleOverlayClick}
        >
          <div
            className={classes.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="login-dialog-title" className={classes.hidden}>
              {t("form.login.login")}
            </h2>
            <button type="button" className={classes.close} onClick={() => setIsOpen(false)}>
              <span aria-hidden="true">&times;</span>
              <span className={classes.hidden}>{t("jemp.label.close", "Fermer")}</span>
            </button>

            <LoginFormClient
              loginUrl={urls.loginUrl}
              isShowRememberMe={isShowRememberMe}
              setUser={setUser}
              handleLoggedIn={handleLoggedIn}
              siteKey={siteKey}
              persona={personaList}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginClient;
