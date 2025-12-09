import TPV from "@quimera-extension/base-tpv";
import core from "@quimera-extension/core";
import login from "@quimera-extension/login";

export default {
  path: "extensions/nadia/tpv",
  views: {},
  subviews: {},
  routes: {
    "/": { type: "view", view: "Home" },
  },
  dependencies: [core, login, TPV],
  menus: {},
};
