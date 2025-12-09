import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import vbarbaFirmaAlb from "@quimera-extension/vbarba-firma_albaranes";
import vbarbaFacturacion from "@quimera-extension/vbarba-facturacion";
import vbarbaAlmacen from "@quimera-extension/vbarba-almacen";
import vbarbaTheme from "./theme";

export default {
  path: "apps/cabrera",
  dependencies: [login, vbarbaAlmacen, vbarbaFirmaAlb, vbarbaFacturacion],
  theme: vbarbaTheme,
};
