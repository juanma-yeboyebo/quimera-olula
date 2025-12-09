import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import vbarbaTheme from "./theme";
import vbarbaFacturacion from "@quimera-extension/vbarba-facturacion";
import vbarbaFirmaAlb from "@quimera-extension/vbarba-firma_albaranes";

export default {
  path: "apps/cash",
  dependencies: [core, login, vbarbaFacturacion, vbarbaFirmaAlb],
  theme: vbarbaTheme,
};
