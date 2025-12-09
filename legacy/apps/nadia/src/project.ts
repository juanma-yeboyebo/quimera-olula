// import nadiaTpv from '@quimera-extension/nadia-tpv'
import almacen from "@quimera-extension/base-almacen";
import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import { mainTheme } from "quimera";

export default {
  path: "projects/nadia",
  dependencies: [core, login, almacen],
  theme: mainTheme,
};
