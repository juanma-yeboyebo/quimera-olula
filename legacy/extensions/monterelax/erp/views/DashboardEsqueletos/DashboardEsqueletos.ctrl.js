import { util } from "quimera";

export const state = parent => ({
  ...parent,
  esqueletos: [],
  historico: [],
  // Control
  tabEsqueletos: 0,
  cargandoDatos: true,
  idEsqueletoActual: null,
  pagina: 0,
  count: 0,
  dialogMsg: "",
  dialogTitle: "",
  habilitarRecepcion: false,
  cantidadRecepcionada: 0,
  esqueletoSeleccionado: null,
  filtroHistorico: ["1", "eq", 1],
  recepcionados: false,
  filtroCola: {
    and: [
      ["pr_trabajadores.idusuario", "eq", util.getUser().user],
      [
        "(lineaspedidosprov.cantidad - lineaspedidosprov.totalenalbaran - lineaspedidosprov.canalbaran)",
        "gt",
        0,
      ],
    ],
  },
});

export const ctrl = parent =>
  class core extends parent {
    onInit() {
      return this.state;
    }

    onTabEsqueletosChanged(state, { value }) {
      return this.setState({
        ...state,
        tabEsqueletos: value,
      });
    }

    onFiltroHistoricoChanged() {
      return this.state;
    }

    onCountRecibido(state, payload) {
      return this.state;
    }

    onRecepcionarClicked(state, payload) {
      return this.setState({
        ...state,
        cantidadRecepcionada: payload.esqueleto.contador,
        habilitarRecepcion: true,
        dialogMsg: "Indique la cantidad a recepcionar",
        dialogTitle: "Recepción de Esqueletos",
        esqueletoSeleccionado: payload.esqueleto,
      });
    }

    onCancelarRecepcionClicked(state, payload) {
      return this.setState({
        ...state,
        habilitarRecepcion: false,
        dialogMsg: "",
        dialogTitle: "",
        cantidadRecepcionada: 0,
        esqueletoSeleccionado: null,
      });
    }

    onConfirmarRecepcionClicked(state, payload) {
      return this.setState({
        ...state,
        habilitarRecepcion: false,
        dialogMsg: "",
        dialogTitle: "",
      });
    }
  };
