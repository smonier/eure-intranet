import { Island, jahiaComponent } from "@jahia/javascript-modules-library";
import classes from "./component.module.css";
import UserDirectoryClient from "./UserDirectory.client";

type Props = {
  "jcr:title"?: string;
  "eui:subtitle"?: string;
};

const readEnv = (key: string): string | undefined => {
  try {
    const javaSystem = (globalThis as unknown as { java?: { lang?: { System?: { getenv?: (k: string) => string } } } })
      ?.java?.lang?.System;
    if (javaSystem?.getenv) {
      const value = javaSystem.getenv(key);
      if (typeof value === "string" && value.length > 0) {
        return value;
      }
    }
  } catch {
    // ignore
  }

  try {
    const processEnv = (globalThis as unknown as {
      process?: { env?: Record<string, string | undefined> };
    }).process?.env;
    const value = processEnv?.[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  } catch {
    // ignore
  }

  return undefined;
};

const resolveApiUrl = () => {
  const envValue = readEnv("USER_DIRECTORY_API_URL");
  if (envValue && envValue.trim().length > 0) {
    return envValue.trim();
  }
  return "https://randomuser.me/api/";
};

const resolveResultsCount = () => {
  const envValue = readEnv("USER_DIRECTORY_RESULTS");
  const parsed = envValue ? Number.parseInt(envValue, 10) : Number.NaN;
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.min(parsed, 500);
  }
  return 100;
};

const apiUrl = resolveApiUrl();
const results = resolveResultsCount();

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:userDirectory",
    name: "default",
    displayName: "User Directory",
  },
  (props: Props) => {
    const title = props["jcr:title"];
    const subtitle = props["eui:subtitle"];

    return (
      <section className={classes.container}>
        {(title || subtitle) && (
          <header className={classes.header}>
            {title && <h2 className={classes.title}>{title}</h2>}
            {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
          </header>
        )}

        <Island component={UserDirectoryClient} props={{ apiUrl, results }} />
      </section>
    );
  },
);
