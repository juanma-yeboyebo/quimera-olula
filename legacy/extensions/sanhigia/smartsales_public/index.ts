import core from "@quimera-extension/core";

import schemas from "./static/schemas";
import * as AltaEmpresa from "./views/AltaEmpresa";
import * as Header from "./views/Header";

export default {
  path: "extensions/sanhigia/smartsales-public",
  views: {
    Header,
    AltaEmpresa,
  },
  subviews: {},
  routes: {
    "/": { type: "view", view: "AltaEmpresa" },
    "/alta": { type: "view", view: "AltaEmpresa" },
  },
  dependencies: [core],
  schemas,
};
