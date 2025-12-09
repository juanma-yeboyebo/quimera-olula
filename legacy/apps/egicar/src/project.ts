import core from "@quimera-extension/core";
import egicar from "@quimera-extension/egicar";
import login from "@quimera-extension/login";
import { mainTheme } from "quimera";

export default {
  path: "apps/egicar",
  dependencies: [core, login, egicar],
  theme: mainTheme,
};
