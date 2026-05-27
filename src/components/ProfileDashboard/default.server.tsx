import {
  Area,
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
    const { currentNode, mainNode } = useServerContext();
    const rc = renderContext as RenderContext;
    const request = rc.getRequest();

    // 1. Resolve profile from logged-in username (persona login)
    const isLoggedIn = rc.isLoggedIn();
    const jahiaUser = isLoggedIn && typeof rc.getUser === "function" ? rc.getUser() : null;
    const jahiaUserNode = jahiaUser as unknown as {
      getName?: () => string;
      hasProperty?: (name: string) => boolean;
      getProperty?: (name: string) => { getString: () => string };
    } | null;
    const loggedUsername: string | null =
      jahiaUserNode && typeof jahiaUserNode.getName === "function"
        ? jahiaUserNode.getName().toLowerCase()
        : null;
    const profileFromLogin = loggedUsername ? (USERNAME_TO_PROFILE[loggedUsername] ?? null) : null;

    // Resolve real first/last name directly from the JahiaUser node (JCRUserNode implements JCRNodeWrapper)
    let realFirstName: string | null = null;
    let realLastName: string | null = null;
    if (jahiaUserNode) {
      try {
        realFirstName =
          typeof jahiaUserNode.hasProperty === "function" && jahiaUserNode.hasProperty("j:firstName")
            ? (jahiaUserNode.getProperty?.("j:firstName").getString() ?? null)
            : null;
        realLastName =
          typeof jahiaUserNode.hasProperty === "function" && jahiaUserNode.hasProperty("j:lastName")
            ? (jahiaUserNode.getProperty?.("j:lastName").getString() ?? null)
            : null;
      } catch (_) {
        // fall back to persona name
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
    // pageNode / pageUrl no longer needed (switcher removed)
    void (mainNode ?? currentNode);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

    return (
      <>
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
