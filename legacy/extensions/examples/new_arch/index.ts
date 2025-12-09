import core from "@quimera-extension/core";

import { Facturas } from "./sections/facturas/Facturas";

export default {
  path: "extensions/examples/new_arch",
  views: {
    Facturas: { ui: Facturas },
  },
  subviews: {},
  routes: {
    "/facturas": { type: "view", view: "Facturas" },
  },
  dependencies: [core],
};
