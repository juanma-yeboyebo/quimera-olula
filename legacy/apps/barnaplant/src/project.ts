import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import vbarbaTheme from "./theme";
import vbarbaFacturacion from "@quimera-extension/vbarba-facturacion";

export default {
  path: "apps/barnaplant",
  dependencies: [core, login, vbarbaFacturacion],
  theme: vbarbaTheme,
};
