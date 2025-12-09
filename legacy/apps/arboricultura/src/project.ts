import login from "@quimera-extension/login";
import vbarbaFacturacion from "@quimera-extension/vbarba-facturacion";

import vbarbaTheme from "./theme";

export default {
  path: "apps/arboricultura",
  dependencies: [login, vbarbaFacturacion],
  theme: vbarbaTheme,
};
