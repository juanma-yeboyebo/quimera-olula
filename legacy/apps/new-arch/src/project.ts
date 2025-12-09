import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import newArch from "@quimera-extension/examples-new_arch";
import { mainTheme } from "quimera";

export default {
  path: "apps/new-arch",
  dependencies: [core, login, newArch],
  theme: mainTheme,
};
