// import areaClientes from "@quimera-extension/base-area_clientes";
import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
// import tiendaOnline from "@quimera-extension/vbarba-tienda_online";
import areaClientes from "@quimera-extension/monterelax-area_clientes";
import { mainTheme } from "quimera";
import TiendaMrelaxTheme from "./theme";

export default {
  path: "apps/tienda-nativa-mon",
  dependencies: [core, login, areaClientes],
  theme: TiendaMrelaxTheme,
  languages: {
    es: { nativeName: "Español" }
  },
};

