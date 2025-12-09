import Quimera from "quimera";
import { createRoot } from "react-dom/client";

import project from "./project";

const environment = {
  production: import.meta.env.MODE !== "development",
  getCurrentTitle: () => import.meta.env.VITE_APP_TITLE,
  inDevelopment: () => import.meta.env.MODE === "development",
  getAPIUrl: () => import.meta.env.VITE_API_URL,
  getUrlDict: () => JSON.parse(import.meta.env.VITE_URL_DICT ?? "{}"),
  client: "tienda-nativa-vbarba",
  // clientLogin: true,
  loginType: "clientes",
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Quimera.App project={project} environment={environment} />);
