import {
  Area,
  AddResources,
  buildModuleFileUrl,
  jahiaComponent,
  useServerContext,
} from "@jahia/javascript-modules-library";
import type { RenderContext } from "org.jahia.services.render";
import type { ProfileDashboardProps, ProfileId, Persona } from "./types.js";
import classes from "./component.module.css";

const PERSONAS: Persona[] = [
  {
    id: "terrain",
    name: "Brigitte Renard",
    role: "Agente Terrain",
    direction: "Direction des Routes et Infrastructures",
    initials: "BR",
    color: "#4A8F3F",
  },
  {
    id: "rh",
    name: "Mathieu Clermont",
    role: "Agent RH",
    direction: "Direction des Ressources Humaines",
    initials: "MC",
    color: "#1C3F6E",
  },
  {
    id: "com",
    name: "Sophie Durand",
    role: "Responsable Communication",
    direction: "Direction de la Communication",
    initials: "SD",
    color: "#b45309",
  },
  {
    id: "encadrant",
    name: "Jean-Pierre Martin",
    role: "Directeur Général",
    direction: "Direction Générale des Services",
    initials: "JPM",
    color: "#7c3aed",
  },
];

const PROFILE_LABELS: Record<ProfileId, string> = {
  terrain: "Agent Terrain",
  rh: "Agent RH",
  com: "Communication",
  encadrant: "Encadrant",
};

/** Map Jahia username → profile ID (for persona simulation via real login) */
const USERNAME_TO_PROFILE: Record<string, ProfileId> = {
  brigitte: "terrain",
  mathieu: "rh",
  sophie: "com",
  "jean-pierre": "encadrant",
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:profileDashboard",
    name: "default",
    displayName: "Profile Dashboard",
    properties: {
      "cache.perUser": "true",
    },
  },
  (props: ProfileDashboardProps, { renderContext }) => {
    const { currentNode, mainNode, jcrSession } = useServerContext();
    const rc = renderContext as RenderContext;
    const request = rc.getRequest();

    // 1. Resolve profile from logged-in username (persona login)
    const isLoggedIn = rc.isLoggedIn();
    const jahiaUser = isLoggedIn && typeof rc.getUser === "function" ? rc.getUser() : null;
    const jahiaUserAny = jahiaUser as unknown as { getName?: () => string } | null;
    const loggedUsername: string | null =
      jahiaUserAny && typeof jahiaUserAny.getName === "function"
        ? jahiaUserAny.getName().toLowerCase()
        : null;
    const profileFromLogin = loggedUsername ? (USERNAME_TO_PROFILE[loggedUsername] ?? null) : null;

    // Resolve real first/last name from JCR user node
    let realFirstName: string | null = null;
    let realLastName: string | null = null;
    if (loggedUsername && jcrSession) {
      try {
        const userNode = jcrSession.getNode(`/users/${loggedUsername}`);
        realFirstName = userNode.hasProperty("j:firstName")
          ? userNode.getProperty("j:firstName").getString()
          : null;
        realLastName = userNode.hasProperty("j:lastName")
          ? userNode.getProperty("j:lastName").getString()
          : null;
      } catch (_) {
        // user node inaccessible — fall back to persona name
      }
    }
    const realFullName =
      realFirstName || realLastName
        ? `${realFirstName ?? ""} ${realLastName ?? ""}`.trim()
        : null;

    // 2. Fallback: ?profile=<id> URL param
    const rawParam = request.getParameter("profile") as string | null;
    const validProfiles: ProfileId[] = ["terrain", "rh", "com", "encadrant"];

    const activeProfile: ProfileId =
      profileFromLogin ??
      (rawParam && validProfiles.includes(rawParam as ProfileId)
        ? (rawParam as ProfileId)
        : (props["eui:defaultProfile"] ?? "terrain"));

    const persona = PERSONAS.find((p) => p.id === activeProfile) ?? PERSONAS[0];
    const showSwitcher = props["eui:showPersonaSwitcher"] !== false;
    // Use mainNode (the page) so the ?profile= param reloads the page, not the content node
    const pageNode = mainNode ?? currentNode;
    const pageUrl = pageNode?.getPath() ? `${request.getContextPath()}/cms/render/live/fr${pageNode.getPath()}.html` : "";

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

    return (
      <>
        {showSwitcher && (
          <AddResources
            type="javascript"
            resources={buildModuleFileUrl(
              "dist/client/components/ProfileDashboard/switcher.client.ts.js",
            )}
          />
        )}

        <div className={classes.dashboard} data-profile={activeProfile}>
          {/* Header banner */}
          <div className={classes.header}>
            <div className={classes.headerInner}>
              <div className={classes.greetingBlock}>
                <div className={classes.avatar} style={{ background: persona.color }}>
                  {realFirstName && realLastName
                    ? `${realFirstName[0]}${realLastName[0]}`.toUpperCase()
                    : persona.initials}
                </div>
                <div>
                  <div className={classes.greeting}>
                    {greeting}, <strong>{realFullName ?? persona.name}</strong>
                  </div>
                  <div className={classes.role}>
                    {persona.role} &bull; {persona.direction}
                  </div>
                </div>
              </div>

              {showSwitcher && (
                <div className={classes.switcherWrapper}>
                  <span className={classes.switcherLabel}>Changer de profil :</span>
                  <div className={classes.profileTabs} role="tablist">
                    {PERSONAS.map((p) => (
                      <a
                        key={p.id}
                        href={`${pageUrl}?profile=${p.id}`}
                        role="tab"
                        aria-selected={p.id === activeProfile}
                        className={`${classes.profileTab} ${p.id === activeProfile ? classes.profileTabActive : ""}`}
                        title={`${p.name} — ${p.role}`}
                        data-profile-tab={p.id}
                      >
                        <span
                          className={classes.tabAvatar}
                          style={{ background: p.color }}
                        >
                          {p.initials}
                        </span>
                        <span className={classes.tabLabel}>{PROFILE_LABELS[p.id]}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile-specific content areas */}
          <div className={classes.content}>
            {activeProfile === "terrain" && (
              <Area name="content-terrain" allowedNodeTypes={["euimix:component"]} />
            )}
            {activeProfile === "rh" && (
              <Area name="content-rh" allowedNodeTypes={["euimix:component"]} />
            )}
            {activeProfile === "com" && (
              <Area name="content-com" allowedNodeTypes={["euimix:component"]} />
            )}
            {activeProfile === "encadrant" && (
              <Area name="content-encadrant" allowedNodeTypes={["euimix:component"]} />
            )}
          </div>
        </div>
      </>
    );
  },
);
