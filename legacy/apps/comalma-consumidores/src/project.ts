import consumidores from "@quimera-extension/comalma-consumidores";
import core from "@quimera-extension/core";
import login from "@quimera-extension/login";

import comalmaTheme from "./theme";

export default {
  path: "apps/comalma-consumidores",
  dependencies: [core, login, consumidores],
  theme: comalmaTheme,
};
