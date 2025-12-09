import { util } from "quimera";
import schemas from "./DashboardRepresentantesMrelax.schema";

export const state = parent => ({
  ...parent,
  datosRepresentantes: {},
  lineChartUnidadesModelo: {},
  lineChartPedidosCliente: {},
  lineChartValorPedidosCliente: {},
  globalPedidos: 0,
  globalVentas: 0,
  comision: 0,
  visibleGerencia: "hidden",
  bufferFiltro: {
    intervaloFecha: "",
    fechaDesde: "",
    fechaHasta: "",
    codagente: "",
  },
});

export const bunch = parent =>({
  ...parent,
  onInit: [
    {
      type: "grape",
      name: "iniciaValoresEstado"
    }
  ],
  iniciaValoresEstado: [
    {
      type: "setStateKeys",
      plug: (_p, { bufferFiltro }) => {
        return { keys: { 
            visibleGerencia: util.getUser().grupo === "G" ? "visible" : "hidden",
            bufferFiltro: { ...bufferFiltro, codagente: util.getUser().codagente !== false ? util.getUser().codagente : "" }
          }
        }
      }
    }
  ],
  getDatosDashboardRepresentantes: [
    {
      type: "patch",
      schema: schemas.dashboardAgentes,
      id: () => "-static-",
      action: "get_datos_dashboard_representantes",
      data: (_p, { bufferFiltro }) => ({ codagente: bufferFiltro.codagente === false ? "" : bufferFiltro.codagente, fechaDesde: bufferFiltro.fechaDesde, fechaHasta: bufferFiltro.fechaHasta}),
      success: "onDatosRecibidos",
    }
  ],
  onDatosRecibidos: [
    {
      condition: ({response}) => response.pedidosCliente.length > 0 || response.unidadesVendasporModelo.length > 0 || response.comisionAcumulada.length > 0,
      type: "setStateKeys",
      plug: ({response}) => {
        const totalesPedidos = response.pedidosCliente.reduce(
          (pedidos, elem) => {
            pedidos.numeroPedidos += elem.numeroPedidos;
            pedidos.valorTotal = (pedidos.valorTotal || 0) + parseFloat(elem.valorPedidos);
  
            return pedidos;
          },
          { numeroPedidos: 0, valorPedidos: 0 },
        );
  
        const chartUnidadesModelo = {
          type: "horizontalBar",
          data: {
            labels: response.unidadesVendasporModelo.map(elem => elem.modelo),
            datasets: [
              {
                label: "Vendidas",
                data: response.unidadesVendasporModelo.map(elem => elem.vendidas),
                borderColor: "#771111",
                backgroundColor: "#771111",
                fill: false,
              },
            ],
          },
          options: {
            aspectRatio: 1.25,
            maintainAspectRatio: true,
            responsive: true,
            title: {
              display: true,
              text: "Nº unidades vendidas por modelo",
              fontSize: 16,
              fontStyle: "bold",
            },
          },
        };

        const chartValorPedidosCliente = {
          type: "horizontalBar",
          data: {
            labels: response.pedidosCliente.map(elem =>
              elem.cliente.length > 17 ? `${elem.cliente.substring(0, 17)}...` : elem.cliente,
            ),
            datasets: [
              {
                label: "Valor pedidos",
                data: response.pedidosCliente.map(elem => elem.valorPedidos),
                borderColor: "#117711",
                backgroundColor: "#117711",
                fill: false,
              },
            ],
          },
          options: {
            aspectRatio: 1.25,
            maintainAspectRatio: true,
            responsive: true,
            tooltips: {
              callbacks: {
                label(t, d) {
                  const xLabel = d.datasets[t.datasetIndex].label;
                  const yLabel = `${util.formatter(t.xLabel, 2)}€`;
  
                  return `${xLabel}: ${yLabel}`;
                },
              },
            },
            title: {
              display: true,
              text: "Valor pedidos por cliente",
              fontSize: 16,
              fontStyle: "bold",
            },
          },
        };
        
        const pedidosporcliente = response.pedidosCliente;
        pedidosporcliente.sort(function (a, b) {
          if (a.numeroPedidos < b.numeroPedidos) {
            return 1;
          }
          if (a.numeroPedidos > b.numeroPedidos) {
            return -1;
          }
  
          // a must be equal to b
          return 0;
        });
        const chartPedidosCliente = {
          type: "horizontalBar",
          data: {
            labels: response.pedidosCliente.map(elem =>
              elem.cliente.length > 17 ? `${elem.cliente.substring(0, 17)}...` : elem.cliente,
            ),
            datasets: [
              {
                label: "Nº pedidos",
                data: response.pedidosCliente.map(elem => elem.numeroPedidos),
                borderColor: "#771111",
                backgroundColor: "#771111",
                fill: false,
              },
            ],
          },
          options: {
            title: {
              display: true,
              text: "Nº de pedidos por cliente",
              fontSize: 16,
              fontStyle: "bold",
            },
            responsive: true,
            aspectRatio: 1.25,
            maintainAspectRatio: true,
          },
        };
  
        const comisionAcumulada =
        response.comisionAcumulada.length > 0
            ? util.formatter(response.comisionAcumulada[0].comisionAcumulada, 2)
            : 0;

        return {
          keys: {
            datosRepresentantes: response,
            lineChartUnidadesModelo: chartUnidadesModelo,
            lineChartValorPedidosCliente: chartValorPedidosCliente,
            lineChartPedidosCliente: chartPedidosCliente,
            globalPedidos: totalesPedidos.numeroPedidos,
            globalVentas: `${util.formatter(totalesPedidos.valorTotal, 2) || 0}€`,
            comision: comisionAcumulada || 0,
          }
        }
      }
    },
    {
      condition: ({response}) => response.pedidosCliente.length === 0 && response.unidadesVendasporModelo.length === 0 && response.comisionAcumulada.length === 0,
      type: "setStateKeys",
      plug: () => ({
          keys: {
          lineChartUnidadesModelo: {},
          lineChartPedidosCliente: {},
          lineChartValorPedidosCliente: {},
          globalPedidos: 0,
          globalVentas: 0,
          comision: 0
        }
      })
    }
  ],
  onBufferFiltroIntervaloFechaChanged:[
    {
      condition: (payload) => payload.value !== undefined,
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => {
        const interval = util.intervalos[payload.value];
        const intervalFechaDesde = interval.desde();
        const intervalFechaHasta = interval.hasta();
        return { keys: { bufferFiltro: { ...bufferFiltro, intervaloFecha: payload.value, fechaDesde: intervalFechaDesde, fechaHasta: intervalFechaHasta} } }
      }
    },
    {
      condition: (payload) => payload.value !== undefined,
      type: "grape",
      name: "getDatosDashboardRepresentantes"
    },
    {
      condition: (payload) => payload.value === undefined,
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => ({
          keys: {
          bufferFiltro: { ...bufferFiltro, intervaloFecha: "", fechaDesde: "", fechaHasta: ""},
          lineChartUnidadesModelo: {},
          lineChartPedidosCliente: {},
          lineChartValorPedidosCliente: {},
          globalPedidos: 0,
          globalVentas: 0,
          comision: 0
        }
      })
    },
  ],
  onBufferFiltroFechaDesdeChanged: [
    {
      condition: (payload) => payload.value !== undefined,
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => {
        return { keys: { bufferFiltro: { ...bufferFiltro, fechaDesde: payload.value} } }
      }
    },
    {
      condition: (_p, { bufferFiltro }) => bufferFiltro.fechaDesde !== "",
      type: "grape",
      name: "getDatosDashboardRepresentantes"
    }
  ],
  onBufferFiltroFechaHastaChanged: [
    {
      condition: (payload) => payload.value !== undefined,
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => {
        return { keys: { bufferFiltro: { ...bufferFiltro, fechaHasta: payload.value} } }
      }
    },
    {
      condition: (_p, { bufferFiltro }) => bufferFiltro.fechaHasta !== "",
      type: "grape",
      name: "getDatosDashboardRepresentantes"
    }
  ],
  onBufferFiltroCodagenteChanged: [
    {
      condition: (payload) => payload.value !== undefined,
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => ({
        keys: { bufferFiltro: { ...bufferFiltro, codagente: payload.value} }
      })
    },
    {
      condition: (payload) => payload.value === undefined,
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => ({
        keys: { 
          bufferFiltro: { ...bufferFiltro, codagente: ""},
          lineChartUnidadesModelo: {},
          lineChartPedidosCliente: {},
          lineChartValorPedidosCliente: {},
          globalPedidos: 0,
          globalVentas: 0,
          comision: 0 
        }
      })
    },
    {
      condition: (_p, { bufferFiltro }) => bufferFiltro.intervaloFecha !== "",
      type: "grape",
      name: "getDatosDashboardRepresentantes"
    }
  ]
});