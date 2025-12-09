import almacen from "@quimera-extension/base-almacen";
import core from "@quimera-extension/core";

// import almacen from '@quimera-mono/extensions/base/almacen'
// import almacen from '../../base/almacen'
// extensions/base/almacen
// /home/jvo/quimera-mono/extensions/core
import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import * as Articulo from "./views/Articulo";
import * as Articulos from "./views/Articulos";
import * as CambiarFinca from "./views/CambiarFinca";
import * as ParteCarro from "./views/ParteCarro";
import * as ParteCarroNuevo from "./views/ParteCarroNuevo";
import * as PartesCarros from "./views/PartesCarros";
import * as PartesCarrosFiltro from "./views/PartesCarros/PartesCarrosFiltro";
import * as PartesCarrosMaster from "./views/PartesCarros/PartesCarrosMaster";
import * as Stock from "./views/Stock";
import * as Stocks from "./views/Stocks";
import * as FirmaParteCarro from "./views/FirmaParteCarro";

export * from "./comps";

export default {
  path: "extensions/vbarba/almacen",
  views: {
    FirmaParteCarro,
    CambiarFinca,
    ParteCarro,
    PartesCarros,
    ParteCarroNuevo,
    Stocks,
    Stock,
    Articulos,
    Articulo,
  },
  subviews: {
    "PartesCarros/PartesCarrosMaster": PartesCarrosMaster,
    "PartesCarros/PartesCarrosFiltro": PartesCarrosFiltro,
  },
  routes: {
    "/": { type: "view", view: "Home" },
    "/cambiarFinca": { type: "view", view: "CambiarFinca" },
    "/partesCarros": { type: "view", view: "PartesCarros" },
    "/partesCarros/:idParte": { type: "view", view: "PartesCarros" },
    "/parteCarros/:codigoParteProp/:idParte": { type: "view", view: "PartesCarros" },
    "/stocks": { type: "view", view: "Stocks" },
    "/stocks/:idRefStockProp/articulo": { type: "view", view: "Stocks" },
    "/stocks/articulo/:referenciaArticulo": { type: "view", view: "Stocks" },
    "/articulos": { type: "view", view: "Articulos" },
    "/articulos/:referenciaProp/articulo": { type: "view", view: "Articulos" },
  },
  dependencies: [core, almacen],
  menus: {
    app: AppMenu,
  },
  rules: {
    'articulos:visit': (check: (rule: string) => boolean) => check('articulos'),
    'stocks:visit': (check: (rule: string) => boolean) => check('stocks'),
    'escarros:visit': (check: (rule: string) => boolean) => check('escarros'),
  },
  schemas,
};
