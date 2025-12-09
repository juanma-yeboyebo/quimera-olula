import { API } from "quimera";

export default parent =>
  class coreAPI extends parent {
    init(payload, dispatch) {
      this.cargarOrdenesCarga(payload, dispatch);
      // const state = this.getState()
      // const actionFiltros = {
      //   type: 'loadFilters',
      //   nextStep: () => this.loadTasks({ type: 'loadTasks' }, dispatch)
      // }
      // this.loadFilters(actionFiltros, dispatch)
    }

    // Se obtienen las ordenes de carga del servidor
    cargarOrdenesCarga(payload, dispatch) {
      console.log("cargarOrdenesCarga");
      API("mx_ordenescarga")
        .get()
        .filter({
          or: [
            ["estado", "eq", "PTE"],
            ["estado", "eq", "EN CURSO"],
          ],
        })
        .page({ limit: 1000 })
        .go("onOrdenesCargaRecibidos", dispatch);
    }

    // Se comprueba si hay unidades cargadas. Si no hay no se puede generar albaran
    onTerminarClicked(payload, dispatch) {
      console.log("Terminar 1", payload);
      const idOrdenDeCarga = `'${payload.data}'`; // Las comillas para que?? Sin ellas no lo entiende el SQL
      API("mx_ordenescargadetalle")
        .get()
        .filter(["idordencarga", "eq", idOrdenDeCarga])
        .page({ limit: 1000 })
        .go("onUnidadesProductoRecibidas", dispatch);
    }

    // Llamada al servidor para generar los albaranes de la orden de carga
    onConfirmarAlbaranesClicked(payload, dispatch) {
      console.log("onConfirmarClicked", this.getState());
      const { idOrdenCarga } = this.getState();
      console.log("onConfirmarClicked", idOrdenCarga);
      // const params = { 1: 1 } // Puede generar errores???
      /* llamaApi('mx_ordenescarga/' + idOrdenCarga + '/generarAlbaranes', params, 'POST', // cambiar la manera de llamar la API
        response => {
          dispatch({
            type: 'onGenerarAlbaranesDone',
            payload: response.data
          })
        },
        error => {
          dispatch({
            type: 'onErrorAlbaranes',
            payload: error
          })
        }
      ) */
      API("mx_ordenescarga")
        .patch(idOrdenCarga, "generarAlbaranes")
        .success(response => {
          dispatch({ type: "onGenerarAlbaranesDone", payload: response.data });
        })
        .error(error => {
          dispatch({ type: "onErrorAlbaranes", payload: error });
        })
        // .download('onGenerarAlbaranesDone', 'report.pdf', dispatch)
        .go("onGenerarAlbaranesDone", dispatch);
    }

    onConfirmarImpresionClicked(payload, dispatch) {
      const { albaranes } = this.getState();
      const { idOrdenCarga } = this.getState();
      API("mx_ordenescarga")
        .patch(idOrdenCarga, "imprimirAlbaranes")
        .set("albaranes", JSON.stringify(albaranes))
        .success(response => {
          dispatch({ type: "onImprimirAlbaranesDone", payload: response.data });
        })
        .error(error => {
          dispatch({ type: "onErrorImprimir", payload: error });
        })
        .go("onImprimirAlbaranesDone", dispatch);
    }

    // Se cambia el estado a TERMINADA de la orden de carga
    onTerminarImpresionClicked(payload, dispatch) {
      const { idOrdenCarga } = this.getState();
      API("mx_ordenescarga")
        .patch(idOrdenCarga)
        .set("estado", "TERMINADA")
        .success(response =>
          dispatch({
            type: "onOrdenTerminada",
            payload: { idorden: idOrdenCarga },
          }),
        )
        .go("onOrdenTerminada", dispatch);
    }
  };
