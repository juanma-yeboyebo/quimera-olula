import { crearRouterLegacy, Dependency } from "@olula/lib/router_legacy.ts";
import Quimera from "quimera";
import "../../../legacy/apps/cabrera//styles/_variables.scss";
import project from "../../../legacy/apps/cabrera/src/project.ts";

const environment = {
  production: import.meta.env.MODE !== "development",
  getCurrentTitle: () => import.meta.env.VITE_APP_TITLE,
  inDevelopment: () => import.meta.env.MODE === "development",
  getAPIUrl: () => import.meta.env.VITE_LEGACY_API_URL,
  getUrlDict: () => JSON.parse(import.meta.env.VITE_URL_DICT ?? "{}"),
  getToken: () => {
    const tk = localStorage.getItem("token-refresco");
    return tk ? `Token ${tk}` : false;
  },
  renderHeader: false,
};

const LegacyAppComp = (
  <Quimera.App project={project} environment={environment} />
);

export const routerLegacy = crearRouterLegacy(
  project as Dependency,
  LegacyAppComp
);
