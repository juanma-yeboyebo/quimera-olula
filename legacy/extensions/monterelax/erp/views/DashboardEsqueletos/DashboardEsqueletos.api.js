import { util } from "quimera";

import schemas from "./DashboardEsqueletos.schema";

// const filtroCola = {
//   and: [
//     ['entregado', 'eq', 'false'],
//     ['mx_estadoesq', 'eq', "'Solicitado'"],
//     ['idlineaap', 'is_null'],
//     ['idlineapp', 'is_not_null']
//   ]
// }

// const filtroCola = {
//   and: [
//     ['pr_trabajadores.idusuario', 'eq', util.getUser().user]
//     //['pr_trabajadores.idusuario', 'eq', `'admin'`]
//   ]
// }

export default parent =>
  class monterelaxAPI extends parent {
    bunch = {
      onInit: [
        {
          type: "grape",
          name: "cargarEsqueletos",
        },
      ],
      onTabEsqueletosChanged: [
        {
          condition: ({ value }) => value === 0,
          type: "grape",
          name: "cargarEsqueletos",
        },
      ],
      cargarEsqueletos: [
        {
          type: "grape",
          name: "cargarCola",
        },
        {
          type: "grape",
          name: "cargarContador",
        },
      ],
      cargarCola: [
        {
          type: "get",
          schema: schemas.cola,
          // filter: (payload, { filtroEsqueletos }) => filtroEsqueletos || ['1', 'eq', 1],
          filter: (payload, { filtroEsqueletos, filtroCola }) =>
            filtroEsqueletos && !util.isEmptyObject(filtroEsqueletos)
              ? { and: [filtroCola, filtroEsqueletos] }
              : filtroCola,
          success: "onColaRecibida",
        },
      ],
      cargarContador: [
        {
          type: "get",
          id: () => "-static-",
          schema: schemas.cola,
          action: "count",
          filter: (payload, { filtroEsqueletos, filtroCola }) =>
            filtroEsqueletos && !util.isEmptyObject(filtroEsqueletos)
              ? { and: [filtroCola, filtroEsqueletos] }
              : filtroCola,
          // filter: (payload, { filtroEsqueletos }) => filtroEsqueletos || ['1', 'eq', 1],
          success: "onCountRecibido",
        },
      ],
      onSwitchClicked: [
        {
          type: "setStateKey",
          plug: payload => ({ path: "recepcionados", value: payload.item }),
        },
        {
          type: "setStateKey",
          plug: (payload, { recepcionados }) => ({
            path: "filtroCola",
            value: {
              and: [
                ["pr_trabajadores.idusuario", "eq", util.getUser().user],
                recepcionados === true
                  ? ["lineaspedidosprov.canalbaran", "gt", 0]
                  : [
                      "(lineaspedidosprov.cantidad - lineaspedidosprov.totalenalbaran - lineaspedidosprov.canalbaran)",
                      "gt",
                      0,
                    ],
              ],
            },
          }),
        },
        {
          type: "grape",
          name: "cargarEsqueletos",
        },
      ],
      onColaRecibida: [
        {
          type: "setStateKeys",
          plug: ({ response }) => ({
            keys: {
              esqueletos: response.data,
              cargandoDatos: false,
            },
          }),
        },
      ],
      onCountRecibido: [
        {
          type: "setStateKey",
          plug: ({ response }) => ({ path: "count", value: response.count }),
        },
      ],
      onFiltroEsqueletosChanged: [
        {
          type: "setStateKey",
          plug: ({ value }) => {
            return { path: "filtroEsqueletos", value };
          },
        },
        {
          type: "grape",
          name: "cargarEsqueletos",
        },
      ],
      onDeshacerClicked: [
        {
          type: "patch",
          schema: schemas.historico,
          action: "deshacerRecepcion",
          id: () => "-static-",
          data: ({ esqueleto }) => esqueleto,
          success: [
            {
              type: "appDispatch",
              name: "mostrarMensaje",
              plug: ({ esqueleto }) => ({
                mensaje: `Se ha deshecho la recepción de ${esqueleto.referencia} correctamente`,
                tipoMensaje: "success",
              }),
            },
            {
              type: "grape",
              name: "cargarEsqueletos",
            },
          ],
        },
      ],
      onConfirmarRecepcionClicked: [
        {
          type: "patch",
          schema: schemas.cola,
          action: "marcarEsqueletoRecepcionado",
          id: () => "-static-",
          data: payload => ({
            idlinea: payload.data.esqueleto.idlinea,
            referencia: payload.data.esqueleto.referencia,
            cantidad: payload.data.cantidad,
            contador: payload.data.esqueleto.contador,
          }),
          success: [
            {
              type: "appDispatch",
              name: "mostrarMensaje",
              plug: payload => ({
                mensaje: `${payload.data.esqueleto.referencia} recepcionada correctamente`,
                tipoMensaje: "success",
              }),
            },
            {
              type: "grape",
              name: "cargarEsqueletos",
            },
          ],
        },
      ],
    };
  };
