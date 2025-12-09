import core from "@quimera-extension/core";
import tiendaVbarba from "@quimera-extension/vbarba-tienda_vbarba";
import * as HeaderContainer from "./views/Container/HeaderContainer";
import * as Header from "./views/Header";

import schemas from "./static/schemas";

export default {
  path: "extensions/tienda_bnp",
  views: {
    Header,
  },
  subviews: {
    HeaderContainer,
  },
  routes: {},
  dependencies: [core, tiendaVbarba],
  schemas,
};
