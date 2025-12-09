
import { util } from "quimera";
import schemas from "./DashboardCosido.schema";

const datosMediaVacio = {
  type: "horizontalBar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Media",
        data: [],
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
          const xLabel = d.datasets[t.datasetIndex].label;
          const yLabel = util.formatter(t.xLabel, 2);

          return `${xLabel}: ${yLabel}`;
        },
      },
    },
    title: {
      display: true,
      text: "Media de unidades por cosedor",
      fontSize: 16,
      fontStyle: "bold",
    },
  },
};
const datosTotalVacio = {
  type: "horizontalBar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Total",
        data: [],
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
          const xLabel = d.datasets[t.datasetIndex].label;
          const yLabel = util.formatter(t.xLabel, 2);

          return `${xLabel}: ${yLabel}`;
        },
      },
    },
    title: {
      display: true,
      text: "UP Totales por cosedor",
      fontSize: 16,
      fontStyle: "bold",
    },
  },
};

export const state = parent => ({
  ...parent,
  cargandoDatos: true,
  arrayCosidoMediaTotal: [],
  arrayCosidoPendientes: [],
  mediaPiezas: 0,
  totalPiezas: 0,
  arrayMedias: [],
  arrayTotales: [],
  datosGraficoPendientes: {},
  datosGraficoMedia: {},
  datosGraficoTotales: {},
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "grape",
      name: "cargarDatos",
    }
  ],
  cargarDatos: [
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.pendientes,
      action: "get_tareas_pendientes_terminadas",
      success: "onDatosGraficoPendienteRecibidos",
    },
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.pendientes,
      action: "get_media_totales",
      success: "onDatosGraficoMediaTotalesRecibidos",
    }
  ],
  onDatosGraficoPendienteRecibidos: [
    {
      log: ({response}) => ["PAYLOAD___", response],
      type: "setStateKey",
      plug: ({ response }) => ({ path: "arrayCosidoPendientes", value: response.arrayPend }),
    },
    {
      type: "grape",
      name: "dibujaGraficoPendientes",
    }
  ],
  onDatosGraficoMediaTotalesRecibidos: [
    {
      condition: ({response}) => response.arrayMediaTotales.length > 0,
      type: "setStateKey",
      plug: ({ response }) => ({ path: "arrayCosidoMediaTotal", value: response.arrayMediaTotales }),
    },
    {
      condition: (_p, { arrayCosidoMediaTotal }) => arrayCosidoMediaTotal.length > 0,
      type: "grape",
      name: "dibujaGraficosMediaTotal",
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "cargandoDatos", value: false }),
    },
  ],
  dibujaGraficosMediaTotal: [
    {
      type: "setStateKeys",
      plug: (_p, { filtroGraficos, arrayCosidoMediaTotal }) => {
        if (Array.isArray(filtroGraficos?.and)) {
          const desde = filtroGraficos?.and.filter(
            e => e[0] === "fechadatos" && e[1] === "gte",
          )[0][2];
          const hasta = new Date(
            filtroGraficos?.and.filter(e => e[0] === "fechadatos" && e[1] === "lte")[0][2],
          );
          const fechaDesde = new Date(desde);
          const fechaHasta = new Date(hasta);
          const datosFiltradosXFecha = arrayCosidoMediaTotal.filter(
            e => new Date(e.fecha) >= fechaDesde && new Date(e.fecha) <= fechaHasta,
          );
          const totalUnidades = datosFiltradosXFecha.reduce(
            (totales, valor) => {
              totales.total += parseFloat(valor.numtareas);

              return totales;
            },
            { total: 0 },
          );
          const totalDias = datosFiltradosXFecha.reduce((arrayDias, valor) => {
            if (!arrayDias.includes(valor.fecha)) {
              arrayDias.push(valor.fecha);
            }

            return arrayDias;
          }, []);
          const mediaUnidades = parseFloat(totalUnidades.total) / totalDias.length;
          const datosXTrabajador = datosFiltradosXFecha.reduce((acum, valor) => {
            if (acum.length > 0 && acum[acum.length - 1][0] === valor.nombre) {
              acum[acum.length - 1][1].push(valor.numtareas);
            } else {
              acum[acum.length] = [valor.nombre, [valor.numtareas]];
            }

            return acum;
          }, []);
          const medias = datosXTrabajador.map(e => [
            e[0],
            e[1].reduce((acum, valor) => acum + valor, 0) / e[1].length,
          ]);
          const totales = datosXTrabajador.map(e => [
            e[0],
            e[1].reduce((acum, valor) => acum + valor, 0),
          ]);
          // objetos media
          const datosGraficoMedia = {
            type: "horizontalBar",
            data: {
              labels: medias.map(elem => elem[0]),
              datasets: [
                {
                  label: "Media",
                  data: medias.map(elem => elem[1]),
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
                    const xLabel = d.datasets[t.datasetIndex].label;
                    const yLabel = util.formatter(t.xLabel, 2);

                    return `${xLabel}: ${yLabel}`;
                  },
                },
              },
              title: {
                display: true,
                text: "Media de unidades por cosedor",
                fontSize: 16,
                fontStyle: "bold",
              },
            },
          };
          // objeto totales
          const datosGraficoTotales = {
            type: "horizontalBar",
            data: {
              labels: totales.map(elem => elem[0]),
              datasets: [
                {
                  label: "Total",
                  data: totales.map(elem => elem[1]),
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
                    const xLabel = d.datasets[t.datasetIndex].label;
                    const yLabel = util.formatter(t.xLabel, 2);

                    return `${xLabel}: ${yLabel}`;
                  },
                },
              },
              title: {
                display: true,
                text: "UP Totales por cosedor",
                fontSize: 16,
                fontStyle: "bold",
              },
            },
          };

          return {
            keys: {
              mediaPiezas: util.formatter(mediaUnidades, 2) || 0,
              totalPiezas: totalUnidades.total,
              datosGraficoMedia,
              datosGraficoTotales,
              arrayMedias: medias,
              arrayTotales: totales,
            },
          };
        }

        return {
          keys: {
            mediaPiezas: 0,
            totalPiezas: 0,
            datosGraficoMedia: datosMediaVacio,
            datosGraficoTotales: datosTotalVacio,
            arrayMedias: [],
            arrayTotales: [],
          },
        };
      },
    },
  ],
  dibujaGraficoPendientes: [
    {
      type: "setStateKey",
      plug: (_p, state) => {
        const datosGrafico = {
          type: "horizontalBar",
          data: {
            labels: state.arrayCosidoPendientes.map(elem => elem.nombre),
            datasets: [
              {
                label: "Confirmados",
                data: state.arrayCosidoPendientes.map(elem => elem.canconfirmada),
                borderColor: "#58D68D",
                backgroundColor: "#58D68D",
                fill: false,
              },
              {
                label: "Pendiente",
                data: state.arrayCosidoPendientes.map(elem => elem.canpendiente),
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
                  let xLabel = "";
                  let yLabel = "";
                  if (t.datasetIndex === 0) {
                    state.suma = t.xLabel;
                  }
                  if (t.datasetIndex === 1) {
                    xLabel = d.datasets[t.datasetIndex].label;
                    yLabel = util.formatter(t.xLabel + state.suma, 2);
                  } else {
                    xLabel = d.datasets[t.datasetIndex].label;
                    yLabel = util.formatter(t.xLabel, 2);
                  }

                  return `${xLabel}: ${yLabel}`;
                },
              },
            },
            title: {
              display: true,
              text: "UP pendientes y confirmadas",
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
              ],
            },
          },
        };

        return { path: "datosGraficoPendientes", value: datosGrafico };
      },
    },
    {
      type: "setStateKey",
      plug: () => ({ path: "cargandoDatos", value: false }),
    }
  ],
  dibujaGraficoMedia: [
    {
      type: "setStateKey",
      plug: (payload, state) => {
        const datosGrafico = {};

        return { path: "datosGraficoMedia", value: datosGrafico };
      },
    },
  ],
  onFiltroGraficosChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "filtroGraficos", value }),
    },
    {
      condition: (payload, { arrayCosidoMediaTotal }) => arrayCosidoMediaTotal.length > 0,
      type: "grape",
      name: "dibujaGraficosMediaTotal",
    },
  ]
});