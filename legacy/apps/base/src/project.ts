import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import { mainTheme } from "quimera";

import ventas from "@quimera-extension/base-ventas";
// import almacen from "@quimera-extension/base-almacen";

export default {
  path: "projects/base",
  dependencies: [core, login, ventas],
  theme: mainTheme,
};


// import core from "@quimera-extension/core";
// import login from "@quimera-extension/login";
// import MrelaxErp from "@quimera-extension/monterelax-erp";

// import MrelaxTheme from "./theme";

// export default {
//   path: "projects/monterelax",
//   dependencies: [core, login, MrelaxErp],
//   theme: MrelaxTheme,
// };
