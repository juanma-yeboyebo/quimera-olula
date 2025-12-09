import almaeventos from "@quimera-extension/almaeventos";
import core from "@quimera-extension/core";
import login from "@quimera-extension/login";

import almaeventosTheme from "./theme";

export default {
  path: "apps/almaeventos",
  dependencies: [almaeventos, core, login],
  theme: almaeventosTheme,
};
