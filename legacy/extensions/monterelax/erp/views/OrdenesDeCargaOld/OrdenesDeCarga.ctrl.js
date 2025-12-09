export const state = parent => ({
  ...parent,
  ordenescarga: [],
  idOrdenCarga: "",
  pagina: 0,
  albaranes: [],
  // Control de los diferentes dialogos
  abrirDialogoConfirmacion: false,
  cargandoAlbaranes: false,
  albaranesGenerados: false,
  errorAlbaranes: false,
  dialogTitle: "",
  dialogMsg: "",
  impresionDone: false,
});

export const ctrl = parent =>
  class core extends parent {
    // Se reciben las ordenes de carga de la API
    onOrdenesCargaRecibidos(state, payload) {
      return this.setState({
        ...state,
        ordenescarga: payload.data,
        pagina: payload.pagina,
        errorMsg: "",
      });
    }

    onOrdenesCargaRecibidosFailed(state, payload) {
      return state;
    }

    onTerminarClicked(state, payload) {
      console.log("Terminar clicked 2", payload);

      return this.setState({
        ...state,
        idOrdenCarga: payload.data,
      });
    }

    // Inicio de proceso para generacion de albaranes
    // Se comprueba si hay unidades cargadas. Si no hay no se puede generar albaran
    onUnidadesProductoRecibidas(state, payload) {
      console.log("onUnidadesProductoRecibidas", state);
      const unidades = payload.data;
      const cargadas = unidades.filter(u => u.estado === "CARGADO");
      let dialogTitle = "";
      let dialogMsg = "";
      if (cargadas.length > 0) {
        dialogTitle = "¿Está seguro de seguir?";
        dialogMsg = `Se han cargado ${cargadas.length} unidades producto de un total de ${unidades.length}`;
      } else {
        dialogTitle = "Aviso";
        dialogMsg = "No puede generar albaranes porque no se han cargado unidades de producto.";
      }

      return this.setState({
        ...state,
        abrirDialogoConfirmacion: true,
        dialogTitle,
        dialogMsg,
      });
    }

    // Cancela proceso
    onCancelarAlbaranesClicked(state, payload) {
      return this.setState({
        ...state,
        abrirDialogoConfirmacion: false,
      });
    }

    // Confirma la generación de albaranes
    onConfirmarAlbaranesClicked(state, payload) {
      console.log("onConfirmarClicked -ctrl");

      return this.setState({
        ...state,
        abrirDialogoConfirmacion: false,
        cargandoAlbaranes: true,
        dialogTitle: "Generando los albaranes",
        dialogMsg: "Espere mientras se generan los albaranes...",
      });
    }

    // Albaranes generados, despliegue de dialogo con información
    onGenerarAlbaranesDone(state, payload) {
      console.log("onGenerarAlbaranesDone", payload);
      const albaranes = payload;
      const id = state.idOrdenCarga;

      return this.setState({
        ...state,
        cargandoAlbaranes: false,
        albaranesGenerados: true,
        albaranes,
        dialogTitle: "Albaranes Generados",
        dialogMsg: `Se han generado los siguientes albaranes asociados a la orden de carga ${id}`,
      });
    }

    // Error al crear los albaranes. Muestra diálogo al usuario notificándolo. ( CODIGOS ERRORES para dar mas info !!! )
    onErrorAlbaranes(state, payload) {
      console.log("onErrorAlbaranes", payload);

      return this.setState({
        ...state,
        cargandoAlbaranes: false,
        errorAlbaranes: true,
        dialogTitle: "Error",
        dialogMsg: "Ha ocurrido un error al intentar generar los albaranes",
      });
    }

    // Impresion de albaranes correcta
    onImprimirAlbaranesDone(state, payload) {
      console.log("onImprimirAlbaranesDone", payload);

      return this.setState({
        ...state,
        impresionDone: true,
        dialogTitle: "Albaranes Generados",
        dialogMsg: "Los albaranes se han impreso correctamente",
      });
    }

    // Error al imprimir los albaranes
    onErrorImprimir(state, payload) {
      console.log("onErrorImprimir", payload);

      return this.setState({
        ...state,
        cargandoAlbaranes: false,
        errorAlbaranes: true,
        dialogTitle: "Error",
        dialogMsg: "Ha ocurrido un error al intentar imprimir los albaranes",
      });
    }

    // Cerrar Diálogo Error y Aviso
    onOkClicked(state, payload) {
      return this.setState({
        ...state,
        abrirDialogoConfirmacion: false,
        errorAlbaranes: false,
      });
    }

    // Imprime albaranes ... ???
    onConfirmarImpresionClicked(state, payload) {
      console.log("onConfirmarImpresionClicked ");

      return this.setState({
        ...state,
        albaranesGenerados: false,
      });
    }

    // El estado de la orden se marca como TERMINADA
    // No debe aparecer en pantalla tras cerrar el diálogo de impresión
    onOrdenTerminada(state, payload) {
      console.log("onOrdenTerminada", payload);
      const idorden = payload.idorden;
      let ordenescarga = state.ordenescarga;
      ordenescarga = ordenescarga.filter(oc => oc.idorden !== idorden);

      return this.setState({
        ...state,
        ordenescarga,
      });
    }

    onTerminarImpresionClicked(state, payload) {
      console.log("Onterminarimpresion", payload);

      return this.setState({
        ...state,
        impresionDone: false,
      });
    }
  };
