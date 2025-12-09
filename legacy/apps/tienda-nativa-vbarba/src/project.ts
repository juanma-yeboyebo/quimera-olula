// import areaClientes from "@quimera-extension/base-area_clientes";
import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import tiendaVbarba from "@quimera-extension/vbarba-tienda_vbarba";

// import tiendaNativa from '@quimera-extension/base-tienda_nativa'
// import { mainTheme } from 'quimera'
import mainTheme from "./theme";

export default {
  path: "projects/tienda-nativa-vbarba",
  dependencies: [core, login, tiendaVbarba],
  theme: mainTheme,
  languages: {
    es: { nativeName: "Español" },
    ca: { nativeName: "Català" },
    en: { nativeName: "English" },
    fr: { nativeName: "Français" },
  },
};
