import login from "@quimera-extension/login";
import vbarbaFirmaAlb from "@quimera-extension/vbarba-firma_albaranes";
import vbarbaFacturacion from "@quimera-extension/vbarba-facturacion";

import vbarbaTheme from "./theme";

export default {
  path: "projects/vbarba-firma-alb",
  dependencies: [login, vbarbaFirmaAlb, vbarbaFacturacion],
  theme: vbarbaTheme,
};
