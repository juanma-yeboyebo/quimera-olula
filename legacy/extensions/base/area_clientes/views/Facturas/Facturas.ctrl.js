import { ModelAPI, ModelCtrl } from "quimera/lib";

import schemas from "./Facturas.schema";

export const state = parent => ({
  ...parent,
  facturas: ModelCtrl(schemas.facturas),
  lineas: ModelCtrl(schemas.lineasfacturas),
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "facturas",
    id: "idFactura",
    schema: schemas.facturas,
    url: "/areaclientes/facturas",
  }),
  ...ModelAPI({
    name: "lineas",
    id: "idLinea",
    schema: schemas.lineasfacturas,
  }),
  onInit: [
    {
      type: "grape",
      name: "getFacturas",
    },
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/areaclientes/facturas",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "facturas.current", value: null }),
    },
  ],
  onidFacturasChanged: [
    {
      type: "grape",
      name: "getLineas",
    },
  ],
});
