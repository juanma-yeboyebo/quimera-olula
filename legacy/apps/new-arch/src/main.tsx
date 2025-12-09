import { FacturasFactory } from "@quimera-extension/examples-new_arch/sections/facturas/FacturasFactory";
import { createRoot } from "react-dom/client";

// import project from "./project";
// import Quimera from "quimera";

// const environment = {
//   production: import.meta.env.MODE !== "development",
//   getCurrentTitle: () => import.meta.env.VITE_APP_TITLE,
//   inDevelopment: () => import.meta.env.MODE === "development",
//   getAPIUrl: () => import.meta.env.VITE_API_URL,
//   getUrlDict: () => JSON.parse(import.meta.env.VITE_URL_DICT ?? "{}"),
// };

const container = document.getElementById("root");
const root = createRoot(container!);
// root.render(<Quimera.App project={project} environment={environment} />);
root.render(<FacturasFactory />);
