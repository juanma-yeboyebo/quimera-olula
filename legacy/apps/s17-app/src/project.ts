import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import partes from "@quimera-extension/studio17-partes_trabajo";
import { mainTheme } from "quimera";

export default {
  path: "projects/s17-app",
  dependencies: [core, login, partes],
  theme: mainTheme,
};
