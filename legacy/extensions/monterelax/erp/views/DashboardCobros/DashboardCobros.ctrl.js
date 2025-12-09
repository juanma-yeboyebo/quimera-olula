import { util } from "quimera";
import schemas from "./DashboardCobros.schema";

export const state = parent => ({
  ...parent,
  lineChartRecibosPendientes: {},
  lineChartRecibosDevueltos: {},
  visibleGerencia: "hidden",
  bufferFiltro: {
    codagente: "",
  },
  suma: 0,
});

export const bunch = parent =>({
  ...parent,
  onInit: [
    {
      type: "grape",
      name: "iniciaValoresEstado"
    },
    {
      type: "grape",
      name: "getDatosDashboardCobros"
    }
  ],
  iniciaValoresEstado: [
    {
      type: "setStateKeys",
      plug: (payload) => ({
        keys: { 
          visibleGerencia: util.getUser().grupo === "G" ? "visible" : "hidden",
          bufferFiltro: { codagente: util.getUser().codagente !== false ? util.getUser().codagente : "" }
       }
      })
    }
  ],
  getDatosDashboardCobros: [
    {
      type: "patch",
      schema: schemas.dashboardCobros,
      id: () => "-static-",
      action: "getRecibos",
      data: (_p, { bufferFiltro }) => ({ codagente: bufferFiltro.codagente === undefined ? "" : bufferFiltro.codagente}),
      success: "onDatosRecibidos",
    }
  ],
  onDatosRecibidos: [
    {
      type: "setStateKeys",
      plug: ({response}) => {
        const chartRecibosPendientes = {
          type: "horizontalBar",
          data: {
            labels: response.recibosPendientes.map(elem => elem.nombrecliente),
            datasets: [
              {
                label: "Imp. vencidos",
                data: response.recibosPendientes.map(elem => elem.importevencidos),
                borderColor: "#EC7063",
                backgroundColor: "#EC7063",
                fill: false,
              },
              {
                label: "Imp. no vencidos",
                data: response.recibosPendientes.map(
                  elem => elem.importenovencidos - elem.importevencidos,
                ),
                borderColor: "#58D68D",
                backgroundColor: "#58D68D",
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
                  let xLabel = "";
                  let yLabel = "";
                  if (t.datasetIndex === 0) {
                    state.suma = t.xLabel;
                  }
                  if (t.datasetIndex === 1) {
                    xLabel = d.datasets[t.datasetIndex].label;
                    yLabel = `${util.formatter(t.xLabel + state.suma, 2)}€`;
                  } else {
                    xLabel = d.datasets[t.datasetIndex].label;
                    yLabel = `${util.formatter(t.xLabel, 2)}€`;
                  }
  
                  return `${xLabel}: ${yLabel}`;
                },
              },
            },
            title: {
              display: true,
              text: "Importe de recibos pendientes",
              fontSize: 16,
              fontStyle: "bold",
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                },
              ],
              yAxes: [
                {
                  stacked: true,
                },
              ]
            }
          }
        };
        const chartRecibosDevueltos = {
          type: "horizontalBar",
          data: {
            labels: response.recibosDevueltos.map(elem => elem.nombrecliente),
            datasets: [
              {
                label: "Imp. devueltos",
                data: response.recibosDevueltos.map(elem => elem.importedevuelto),
                borderColor: "#EC7063",
                backgroundColor: "#EC7063",
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
              text: "Importe de recibos devueltos",
              fontSize: 16,
              fontStyle: "bold",
            },
          },
        };

        return {
          keys: {
            lineChartRecibosPendientes: chartRecibosPendientes,
            lineChartRecibosDevueltos: chartRecibosDevueltos,
          }
        }
      }
    }
  ],
  onBufferFiltroCodagenteChanged: [
    {
      type: "setStateKeys",
      plug: (payload) => ({
        keys: { bufferFiltro: {codagente: payload.value} }
      })
    },
    {
      type: "grape",
      name: "getDatosDashboardCobros"
    }
  ]
});
