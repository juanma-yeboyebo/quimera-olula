import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import { mainTheme } from "quimera";
import analisis from "@quimera-extension/base-analisis";

export default {
  path: "apps/business-intelligence",
  dependencies: [core, login, analisis],
  theme: mainTheme,
};
