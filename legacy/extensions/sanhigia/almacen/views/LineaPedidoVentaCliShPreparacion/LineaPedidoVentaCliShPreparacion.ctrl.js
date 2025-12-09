import { applyBunch, shortcutsBunch, shortcutsState } from "quimera/lib";

import data from "./LineaPedidoVentaCliShPreparacion.ctrl.yaml";

export const state = parent => ({
  ...parent,
  ...shortcutsState(data.shortcuts),
  ...data.state,
});
export const bunch = parent => ({
  ...parent,
  ...shortcutsBunch(data.shortcuts),
  ...applyBunch(data.bunch, parent),
  // focusCodBarras: [
  //   // {
  //   //   type: 'function',
  //   //   function: (_, {linea}) => console.log(document.getElementById("codBarras"))
  //   // },
  //   {
  //     condition: () => !!document.getElementById("codBarras"),
  //     type: "function",
  //     function: () => document.getElementById("codBarras").select(),
  //   },
  // ],
  irAMovilotes: [
    {
      type: "navigate",
      url: ({ idLinea }, { linea }) =>
        `/sh_preparaciondepedidos/${linea.buffer.codPreparacionDePedido}/movilotes/${idLinea}`,
    },
  ],
});
