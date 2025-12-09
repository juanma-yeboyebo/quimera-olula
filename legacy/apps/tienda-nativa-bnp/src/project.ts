import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import tiendaBnp from "@quimera-extension/vbarba-tienda_bnp";
import { mainTheme } from "quimera";

export default {
  path: "projects/tienda-nativa-bnp",
  dependencies: [core, login, tiendaBnp],
  theme: mainTheme,
  languages: {
    es: { nativeName: "Español" },
    ca: { nativeName: "Català" },
    en: { nativeName: "English" },
    fr: { nativeName: "Français" },
  },
};
