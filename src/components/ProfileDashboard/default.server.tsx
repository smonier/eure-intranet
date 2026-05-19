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

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:profileDashboard",
    name: "default",
    displayName: "Profile Dashboard",
  },
  (props: ProfileDashboardProps, { renderContext }) => {
    const { currentNode } = useServerContext();
    const rc = renderContext as RenderContext;
    const request = rc.getRequest();

    const rawParam = request.getParameter("profile") as string | null;
    const validProfiles: ProfileId[] = ["terrain", "rh", "com", "encadrant"];
    const activeProfile: ProfileId =
      rawParam && validProfiles.includes(rawParam as ProfileId)
        ? (rawParam as ProfileId)
        : (props["eui:defaultProfile"] ?? "terrain");

    const persona = PERSONAS.find((p) => p.id === activeProfile) ?? PERSONAS[0];
    const showSwitcher = props["eui:showPersonaSwitcher"] !== false;
    const pageUrl = currentNode?.getPath() ? `${request.getContextPath()}/cms/render/live/fr${currentNode.getPath()}.html` : "";

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
                  {persona.initials}
                </div>
                <div>
                  <div className={classes.greeting}>
                    {greeting}, <strong>{persona.name}</strong>
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
