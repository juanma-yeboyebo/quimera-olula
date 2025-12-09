import administracion from "@quimera-extension/comalma-administracion";
import core from "@quimera-extension/core";
import login from "@quimera-extension/login";

import comalmaTheme from "./theme";

export default {
  path: "apps/comalma",
  dependencies: [core, login, administracion],
  theme: comalmaTheme,
};
