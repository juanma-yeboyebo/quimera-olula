import { getSchemas } from "quimera";
// import { navigate } from 'quimera'

export const state = parent => ({
  ...parent,
  cliNuevos: [],
  ordenCliNuevos: {
    field: "codcliente",
    direction: "ASC",
  },
  pagina: {
    limit: 20,
    next: null,
    previous: null,
  },
  refs: {},
  fechaDesde: null,
  emailsSeleccionados: {},
  listaEmails: "",
  abrirMostrarEmails: false,
  soloSeleccionados: false,
  estadoVista: "limpio",
});

export const bunch = parent => ({
  ...parent,
  init: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "refs", value: {} }),
    },
  ],
  cargarClientes: [
    {
      type: "setStateKey",
      plug: () => ({ path: "estadoVista", value: "lanzando" }),
    },
    {
      type: "function",
      function: ({ page }, { pagina }) => {
        let nuevaPagina = { limit: pagina.limit };
        let limpia = true;
        if (page === "next") {
          limpia = false;
          nuevaPagina = {
            limit: pagina.limit,
            next: pagina.next,
          };
        } else if (page === "previous") {
          nuevaPagina = {
            limit: pagina.limit,
            previous: pagina.previous,
          };
        } else if (page === "first") {
          nuevaPagina = {
            limit: pagina.limit,
          };
        }

        return { limpiaListado: limpia, pagina: nuevaPagina };
      },
      success: [
        {
          condition: ({ response }) => response.limpiaListado,
          type: "setStateKey",
          plug: () => ({ path: "cliNuevos", value: [] }),
        },
        {
          type: "get",
          schema: () => getSchemas().clientesNuevos,
          page: ({ response }) => response.pagina,
          order: (_, { ordenCliNuevos }) => ordenCliNuevos,
          params: (_, { refs, fechaDesde }) => ({ ...refs, fecha: fechaDesde }),
          success: "onDatosRecibidos",
        },
      ],
    },
  ],
  onCerrarMostrarEmails: [
    {
      type: "setStateKey",
      plug: () => ({ path: "abrirMostrarEmails", value: false }),
    },
  ],
  onCopiarAClipboardClicked: [
    {
      type: "function",
      function: (_, { listaEmails }) => {
        navigator.clipboard.writeText(listaEmails);
      },
      success: [
        {
          type: "showMessage",
          plug: () => ({ mensaje: `Copiado el listado de emails.`, tipoMensaje: "success" }),
        },
      ],
    },
  ],
  onDatosRecibidos: [
    {
      log: ({ response }, { cliNuevos }) => ["mimensaje290", response],
      type: "setStateKeys",
      plug: ({ response }, { cliNuevos }) => ({
        keys: {
          cliNuevos: [...cliNuevos, ...response.data],
          pagina: response.page,
          estadoVista:
            cliNuevos.length > 0 || response.data.length > 0
              ? "lanzadoConResultados"
              : "lanzadoSinResultados",
        },
      }),
    },
  ],
  onFechaDesdeChanged: [
    {
      type: "setStateKeys",
      plug: ({ value }) => ({
        keys: {
          fechaDesde: value,
          estadoVista: "limpio",
        },
      }),
    },
  ],
  onLanzarInformeClicked: [
    {
      type: "grape",
      name: "limpiarTabla",
    },
    {
      type: "grape",
      name: "cargarClientes",
    },
  ],
  onLimpiarDatosClicked: [
    {
      type: "grape",
      name: "limpiarTabla",
    },
    {
      type: "grape",
      name: "limpiarFormulario",
    },
  ],
  limpiarTabla: [
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          cliNuevos: [],
          ordenCliNuevos: { field: "codcliente", direction: "ASC" },
          pagina: { limit: 20, next: null, previous: null },
          estadoVista: "limpio",
          emailsSeleccionados: {},
          listaEmails: "",
          abrirMostrarEmails: false,
          soloSeleccionados: false,
        },
      }),
    },
  ],
  limpiarFormulario: [
    {
      type: "setStateKeys",
      plug: () => ({
        keys: {
          refs: {},
          fechaDesde: null,
        },
      }),
    },
  ],
  onMarcarSoloSeleccionadosClicked: [
    {
      type: "setStateKey",
      plug: (_, { soloSeleccionados }) => ({
        path: "soloSeleccionados",
        value: !soloSeleccionados,
      }),
    },
  ],
  onMostrarSiguienteClicked: [
    {
      type: "grape",
      name: "cargarClientes",
      plug: () => ({ page: "next" }),
    },
  ],
  onObtenerEmailsClicked: [
    {
      type: "setStateKey",
      plug: ({ data }, { emailsSeleccionados }) => {
        const listaEmailsAux = [];
        for (const email in emailsSeleccionados) {
          listaEmailsAux.push(emailsSeleccionados[email]);
        }

        return { path: "listaEmails", value: listaEmailsAux.join(",\n") };
      },
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "abrirMostrarEmails", value: true }),
    },
  ],
  onRefsChanged: [
    {
      type: "setStateKeys",
      plug: ({ field, value }, { refs }) => {
        const refsAux = refs;
        if (value !== undefined) {
          refsAux[field] = value;
        } else if (value === undefined && field in refsAux) {
          delete refsAux[field];
        }

        return {
          keys: {
            refs: refsAux,
            estadoVista: "limpio",
          },
        };
      },
    },
  ],
  onSeleccionarClienteClicked: [
    {
      type: "setStateKeys",
      plug: ({ data }, { cliNuevos, emailsSeleccionados }) => {
        const cliNuevosAux = cliNuevos;
        const listaEmailsAux = emailsSeleccionados;
        for (const cliente of cliNuevosAux) {
          if (cliente.codCliente === data.codCliente) {
            cliente.seleccionada = cliente.seleccionada ? false : true;
            if (cliente.email) {
              if (cliente.codCliente in listaEmailsAux) {
                delete listaEmailsAux[cliente.codCliente];
              } else {
                listaEmailsAux[cliente.codCliente] = cliente.email;
              }
            }
          }
        }

        return {
          keys: {
            cliNuevos: cliNuevosAux,
            emailsSeleccionados: listaEmailsAux,
          },
        };
      },
    },
  ],
  onTdbClientesNuevosColumnClicked: [
    {
      condition: (_, { soloSeleccionados }) => !soloSeleccionados,
      type: "setStateKey",
      plug: ({ data }, { ordenCliNuevos }) => ({
        path: "ordenCliNuevos",
        value: {
          field: data.order,
          direction:
            data.order === ordenCliNuevos.field
              ? ordenCliNuevos.direction === "DESC"
                ? "ASC"
                : "DESC"
              : "ASC",
        },
      }),
    },
    {
      condition: (payload, { soloSeleccionados }) => !soloSeleccionados && payload.data.order,
      type: "grape",
      name: "cargarClientes",
    },
  ],
});
