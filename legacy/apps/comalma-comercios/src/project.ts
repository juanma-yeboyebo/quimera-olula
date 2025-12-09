import comercios from "@quimera-extension/comalma-comercios";
import core from "@quimera-extension/core";
import login from "@quimera-extension/login";

import comalmaTheme from "./theme";

export default {
  path: "apps/comalma-comercios",
  dependencies: [core, login, comercios],
  theme: comalmaTheme,
};
