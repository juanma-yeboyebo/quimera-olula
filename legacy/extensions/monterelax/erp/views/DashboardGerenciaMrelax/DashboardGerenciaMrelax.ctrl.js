import { util } from "quimera";

import schemas from "./DashboardGerenciaMrelax.schema";

export const state = parent => ({
  ...parent,
  lineChartImportesProps: {
    options: {
      title: {
        display: true,
        fontSize: 16,
        fontStyle: "bold",
        text: "Importe de piezas por día",
      },
    },
  },
  lineChartPiezasProps: {
    options: {
      title: {
        display: true,
        fontSize: 16,
        fontStyle: "bold",
        text: "Nº de piezas por día",
      },
    },
  },
  lineChartMetrosProps: {
    options: {
      title: {
        display: true,
        fontSize: 16,
        fontStyle: "bold",
        text: "Metros por día",
      },
    },
  },
  lineChartPiezasCorCosRevProps: {
    options: {
      title: {
        display: true,
        fontSize: 16,
        fontStyle: "bold",
        text: "Piezas cortadas, cosidas y revestidas",
      },
    },
  },
  mediaFabricadas: 0,
  mediaRetrasoSalida: 0,
  mediaDiasServicio: 0,
  totalPedidas: 0,
  totalFabricadas: 0,
  totalCortadas: 0,
  totalCosidas: 0,
  totalRevestidas: 0,
  mediaPiezasPedidas: 0,
  mediaPiezasFabricadas: 0,
  mediaImportePiezasPedidas: 0,
  mediaImportePiezasFabricadas: 0,
  mediaMetrosPedidos: 0,
  mediaMetrosCortados: 0,
  mediaPiezasCortadas: 0,
  mediaPiezasCosidas: 0,
  mediaPiezasRevestidas: 0,
  piezasArr: [],
  metrosCortadosArr: [],
  metrosPedidosArr: [],
  arrayPiezasCortadas: [],
  arrayPiezasCosidas: [],
  arrayPiezasRevestidas: [],
  arrayPiezasCorCosRev: [],
  retrasoFabricadas: [],
  retrasoSalidaProducto: [],
  piezasPedidasTitle: "Piezas pedidas",
  piezasFabricadasTitle: "Piezas fabricadas",
  cargandoDatos: true,
  bufferFiltro: {
    intervaloFecha: "",
    fechaDesde: null,
    fechaHasta: null,
  },
  idTabDashboard: 0,
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "grape",
      name: "cargarDatos",
    },
  ],
  cargarDatos: [
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.datos,
      action: "getMetrosPedidos",
      success: "onGetMetrosPedidosRecibidos",
    },
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.datos,
      action: "getMetrosCortados",
      success: "ongetMetrosCortadosRecibidos",
    },
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.datos,
      action: "getPiezasPedidasFabricadas",
      success: "ongetPiezasPedidasFabricadasRecibidos",
    },
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.datos,
      action: "getRetrasoFabricadas",
      success: "ongetRetrasoFabricadasRecibidos",
    },
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.datos,
      action: "getRetrasoSalidaProducto",
      success: "ongetRetrasoSalidaProductoRecibidos",
    },
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.datos,
      action: "getPiezasCortadasCosidasRevestidas",
      success: "ongetPiezasCortadasCosidasRevestidasRecibidos",
    },
    {
      type: "setStateKeys",
      plug: () => {
        const interval = util.intervalos["preWeek"];
        const intervalFechaDesde = interval.desde();
        const intervalFechaHasta = interval.hasta();
        return {
          keys: {
            bufferFiltro: {
              intervaloFecha: "preWeek",
              fechaDesde: intervalFechaDesde,
              fechaHasta: intervalFechaHasta,
            },
          },
        };
      },
    },
  ],
  onGetMetrosPedidosRecibidos: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          metrosPedidosArr: response.arrayMetrosPedidos,
        },
      }),
    },
  ],
  ongetMetrosCortadosRecibidos: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          metrosCortadosArr: response.arrayMetrosCortados,
        },
      }),
    },
    {
      type: "grape",
      name: "dibujaGraficoMetrosDia",
    },
  ],
  ongetPiezasPedidasFabricadasRecibidos: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          piezasArr: response.arrayPedidasFabricadas,
        },
      }),
    },
    {
      type: "grape",
      name: "dibujaGraficoPiezas",
    },
  ],
  ongetRetrasoFabricadasRecibidos: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          retrasoFabricadas: response.arrayPiezas,
        },
      }),
    },
    {
      type: "grape",
      name: "calculaRetrasoFabricadas",
    },
  ],
  ongetRetrasoSalidaProductoRecibidos: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          retrasoSalidaProducto: response.arrayPiezas,
        },
      }),
    },
    {
      type: "grape",
      name: "calculaRetrasoSalidaProducto",
    },
  ],
  ongetPiezasCortadasCosidasRevestidasRecibidos: [
    {
      type: "setStateKeys",
      plug: ({ response }) => ({
        keys: {
          arrayPiezasCorCosRev: response.arrayPiezasCorCosRev,
          cargandoDatos: false,
        },
      }),
    },
    {
      type: "grape",
      name: "dibujaGraficoPiezasCorCosRev",
    },
  ],
  dibujaGraficoMetrosDia: [
    {
      type: "setStateKeys",
      plug: (_p, { metrosPedidosArr, bufferFiltro, metrosCortadosArr }) => {
        const arrMetrosPedidosData = metrosPedidosArr.filter(
          elem => elem.dia >= bufferFiltro.fechaDesde && elem.dia <= bufferFiltro.fechaHasta,
        );
        const arrMetrosCortadosData = metrosCortadosArr.filter(
          elem => elem.dia >= bufferFiltro.fechaDesde && elem.dia <= bufferFiltro.fechaHasta,
        );
        const totalesMetrosCortados = arrMetrosCortadosData.reduce(
          (totales, metros) => {
            totales.totalCortados += parseFloat(metros.metroscortados);
            totales.diasCortados += metros.metroscortados > 0 ? 1 : 0;

            return totales;
          },
          { totalCortados: 0, diasCortados: 0 },
        );

        const totalesMetrosPedidos = arrMetrosPedidosData.reduce(
          (totales, metros) => {
            totales.totalPedidos += parseFloat(metros.metrospedidos);
            totales.diasPedidos += metros.metrospedidos > 0 ? 1 : 0;

            return totales;
          },
          { totalPedidos: 0, diasPedidos: 0 },
        );
        const mediaMetrosPedidos =
          parseFloat(totalesMetrosPedidos.totalPedidos) / totalesMetrosPedidos.diasPedidos;
        const mediaMetrosCortados =
          parseFloat(totalesMetrosCortados.totalCortados) / totalesMetrosCortados.diasCortados;
        const lineChartMetros = {
          type: "line",
          data: {
            labels: arrMetrosPedidosData.map(elem => elem.dia),
            datasets: [
              {
                label: "Metros Pedidos",
                data: arrMetrosPedidosData.map(elem => elem.metrospedidos),
                borderColor: "#771111",
                fill: false,
              },
              {
                label: "Metros Cortados",
                data: arrMetrosCortadosData.map(elem => elem.metroscortados),
                borderColor: "#117711",
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
              text: "Metros por día",
              fontSize: 16,
              fontStyle: "bold",
            },
            annotation: {
              annotations: [
                {
                  type: "line",
                  mode: "horizontal",
                  scaleID: "y-axis-0",
                  value: mediaMetrosPedidos,
                  borderColor: "tomato",
                  borderWidth: 2,
                  label: {
                    backgroundColor: "red",
                    content: "Media Pedidos",
                    enabled: true,
                    position: "left",
                    fontSize: 10,
                  },
                },
                {
                  type: "line",
                  mode: "horizontal",
                  scaleID: "y-axis-0",
                  value: mediaMetrosCortados,
                  borderColor: "green",
                  borderWidth: 2,
                  label: {
                    backgroundColor: "green",
                    content: "Media Cortados",
                    enabled: true,
                    position: "left",
                    fontSize: 10,
                  },
                },
              ],
              drawTime: "beforeDatasetsDraw", // (default)
            },
          },
        };
        return {
          keys: {
            lineChartMetrosProps: lineChartMetros,
            mediaMetrosCortados: util.formatter(mediaMetrosCortados, 2) || 0,
            mediaMetrosPedidos: util.formatter(mediaMetrosPedidos, 2) || 0,
          },
        };
      },
    },
  ],
  dibujaGraficoPiezas: [
    {
      type: "setStateKeys",
      plug: (_p, { piezasArr, bufferFiltro }) => {
        const arrPiezasData = piezasArr.filter(
          elem => elem.dia >= bufferFiltro.fechaDesde && elem.dia <= bufferFiltro.fechaHasta,
        );

        const totalesPiezas = arrPiezasData.reduce(
          (totales, piezas) => {
            totales.totalPedidas += piezas.numeropedidas;
            totales.totalFabricadas += piezas.numerofabricadas;
            totales.totalImportePedidas += parseFloat(piezas.importepedidas);
            totales.totalImporteFabricadas += parseFloat(piezas.importefabricadas);
            totales.diasPedidas += piezas.numeropedidas > 0 ? 1 : 0;
            totales.diasFabricadas += piezas.numerofabricadas > 0 ? 1 : 0;

            return totales;
          },
          {
            totalPedidas: 0,
            totalFabricadas: 0,
            totalImportePedidas: 0,
            totalImporteFabricadas: 0,
            diasPedidas: 0,
            diasFabricadas: 0,
          },
        );

        const mediaPiezasPedidas = parseInt(totalesPiezas.totalPedidas) / totalesPiezas.diasPedidas;
        const mediaPiezasFabricadas =
          parseInt(totalesPiezas.totalFabricadas) / totalesPiezas.diasFabricadas;
        const mediaImportePiezasPedidas =
          parseFloat(totalesPiezas.totalImportePedidas) / totalesPiezas.diasPedidas;
        const mediaImportePiezasFabricadas =
          parseFloat(totalesPiezas.totalImporteFabricadas) / totalesPiezas.diasFabricadas;

        const lineChartPiezas = {
          type: "line",
          data: {
            labels: arrPiezasData.map(elem => elem.dia),
            datasets: [
              {
                label: "Pedidas",
                data: arrPiezasData.map(elem => elem.numeropedidas),
                borderColor: "#771111",
                fill: false,
              },
              {
                label: "Fabricadas",
                data: arrPiezasData.map(elem => elem.numerofabricadas),
                borderColor: "#117711",
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
              text: "Nº de piezas por día",
              fontSize: 16,
              fontStyle: "bold",
            },
            annotation: {
              annotations: [
                {
                  type: "line",
                  mode: "horizontal",
                  scaleID: "y-axis-0",
                  value: mediaPiezasPedidas,
                  borderColor: "tomato",
                  borderWidth: 2,
                  label: {
                    backgroundColor: "red",
                    content: "Media Pedidas",
                    enabled: true,
                    position: "left",
                    fontSize: 10,
                  },
                },
                {
                  type: "line",
                  mode: "horizontal",
                  scaleID: "y-axis-0",
                  value: mediaPiezasFabricadas,
                  borderColor: "green",
                  borderWidth: 2,
                  label: {
                    backgroundColor: "green",
                    content: "Media Fabricadas",
                    enabled: true,
                    position: "left",
                    fontSize: 10,
                  },
                },
              ],
              drawTime: "beforeDatasetsDraw", // (default)
            },
          },
        };

        const lineChartImportes = {
          type: "line",
          data: {
            labels: arrPiezasData.map(elem => elem.dia),
            datasets: [
              {
                label: "Importe pedidas",
                data: arrPiezasData.map(elem => elem.importepedidas),
                borderColor: "#771111",
                fill: false,
              },
              {
                label: "Importe fabricadas",
                data: arrPiezasData.map(elem => elem.importefabricadas),
                borderColor: "#117711",
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
              text: "Importe piezas por día",
              fontSize: 16,
              fontStyle: "bold",
            },
          },
        };

        return {
          keys: {
            lineChartPiezasProps: lineChartPiezas,
            lineChartImportesProps: lineChartImportes,
            mediaPiezasPedidas: util.formatter(mediaPiezasPedidas, 2) || 0,
            mediaPiezasFabricadas: util.formatter(mediaPiezasFabricadas, 2) || 0,
            totalPedidas: util.formatter(totalesPiezas.totalPedidas, 0),
            totalFabricadas: util.formatter(totalesPiezas.totalFabricadas, 0),
            mediaImportePiezasPedidas: util.formatter(mediaImportePiezasPedidas, 2) || 0,
            mediaImportePiezasFabricadas: util.formatter(mediaImportePiezasFabricadas, 2) || 0,
          },
        };
      },
    },
  ],
  calculaRetrasoFabricadas: [
    {
      type: "setStateKeys",
      plug: (_p, { retrasoFabricadas, bufferFiltro }) => {
        const arrRetrasoFabricadas = retrasoFabricadas.filter(
          elem =>
            elem.fechaembalaje >= bufferFiltro.fechaDesde &&
            elem.fechaembalaje <= bufferFiltro.fechaHasta,
        );

        const totalRetrasoFabricadas = arrRetrasoFabricadas.reduce((totales, retraso) => {
          totales += retraso.retrasofabricacion > 0 ? retraso.retrasofabricacion : 0;

          return totales;
        }, 0);

        const mediaFabricadas = totalRetrasoFabricadas / arrRetrasoFabricadas.length;

        return {
          keys: {
            mediaFabricadas: util.formatter(mediaFabricadas, 2) || 0,
          },
        };
      },
    },
  ],
  calculaRetrasoSalidaProducto: [
    {
      type: "setStateKeys",
      plug: (_p, { retrasoSalidaProducto, bufferFiltro }) => {
        const arrRetrasoSalidaProducto = retrasoSalidaProducto.filter(
          elem =>
            elem.fechaenvio >= bufferFiltro.fechaDesde &&
            elem.fechaenvio <= bufferFiltro.fechaHasta,
        );

        const totalRetrasoSalida = arrRetrasoSalidaProducto.reduce(
          (totales, retraso) => {
            totales.diasServicio += retraso.diasservicio > 0 ? retraso.diasservicio : 0;
            totales.retrasoSalida += retraso.retrasosalida > 0 ? retraso.retrasosalida : 0;
            totales.ceros += retraso.retrasosalida < 0 ? 1 : 0;

            return totales;
          },
          { diasServicio: 0, retrasoSalida: 0, ceros: 0 },
        );

        const mediaRetrasoSalida =
          totalRetrasoSalida.retrasoSalida / arrRetrasoSalidaProducto.length;
        const mediaDiasServicio = totalRetrasoSalida.diasServicio / arrRetrasoSalidaProducto.length;

        return {
          keys: {
            mediaRetrasoSalida: util.formatter(mediaRetrasoSalida, 2) || 0,
            mediaDiasServicio: util.formatter(mediaDiasServicio, 2) || 0,
          },
        };
      },
    },
  ],
  dibujaGraficoPiezasCorCosRev: [
    {
      type: "setStateKeys",
      plug: (_p, { arrayPiezasCorCosRev, bufferFiltro }) => {
        const arrayPiezasCorCosRevData = arrayPiezasCorCosRev.filter(
          elem => elem.dia >= bufferFiltro.fechaDesde && elem.dia <= bufferFiltro.fechaHasta,
        );

        const totalPiezasCorCosRev = arrayPiezasCorCosRevData.reduce(
          (totales, piezas) => {
            totales.totalCortadas += parseFloat(piezas.numerocortadas);
            totales.totalCosidas += parseFloat(piezas.numerocosidas);
            totales.totalRevestidas += parseFloat(piezas.numerorevestidas);
            totales.diasCortadas += piezas.numerocortadas > 0 ? 1 : 0;
            totales.diasCosidas += piezas.numerocosidas > 0 ? 1 : 0;
            totales.diasRevestidas += piezas.numerorevestidas > 0 ? 1 : 0;

            return totales;
          },
          {
            totalCortadas: 0,
            totalCosidas: 0,
            totalRevestidas: 0,
            diasCortadas: 0,
            diasCosidas: 0,
            diasRevestidas: 0,
          },
        );

        const mediaPiezasCortadas =
          parseFloat(totalPiezasCorCosRev.totalCortadas) / totalPiezasCorCosRev.diasCortadas;
        const mediaPiezasCosidas =
          parseFloat(totalPiezasCorCosRev.totalCosidas) / totalPiezasCorCosRev.diasCosidas;
        const mediaPiezasRevestidas =
          parseFloat(totalPiezasCorCosRev.totalRevestidas) / totalPiezasCorCosRev.diasRevestidas;

        const lineChartPiezasCorCosRev = {
          type: "line",
          data: {
            labels: arrayPiezasCorCosRevData.map(elem => elem.dia),
            datasets: [
              {
                label: "Piezas Cortadas",
                data: arrayPiezasCorCosRevData.map(elem => elem.numerocortadas),
                borderColor: "#771111",
                fill: false,
              },
              {
                label: "Piezas Cosidas",
                data: arrayPiezasCorCosRevData.map(elem => elem.numerocosidas),
                borderColor: "#117711",
                fill: false,
              },
              {
                label: "Piezas Revestidas",
                data: arrayPiezasCorCosRevData.map(elem => elem.numerorevestidas),
                borderColor: "#1E90FF",
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
              text: "Piezas Cortadas, Cosidas y Revestidas",
              fontSize: 16,
              fontStyle: "bold",
            },
            annotation: {
              annotations: [
                {
                  type: "line",
                  mode: "horizontal",
                  scaleID: "y-axis-0",
                  value: mediaPiezasCortadas,
                  borderColor: "tomato",
                  borderWidth: 2,
                  label: {
                    backgroundColor: "red",
                    content: "Media Piezas Cortadas",
                    enabled: true,
                    position: "left",
                    fontSize: 10,
                  },
                },
                {
                  type: "line",
                  mode: "horizontal",
                  scaleID: "y-axis-0",
                  value: mediaPiezasCosidas,
                  borderColor: "green",
                  borderWidth: 2,
                  label: {
                    backgroundColor: "green",
                    content: "Media Piezas Cosidas",
                    enabled: true,
                    position: "left",
                    fontSize: 10,
                  },
                },
                {
                  type: "line",
                  mode: "horizontal",
                  scaleID: "y-axis-0",
                  value: mediaPiezasRevestidas,
                  borderColor: "blue",
                  borderWidth: 2,
                  label: {
                    backgroundColor: "blue",
                    content: "Media Piezas Revestidas",
                    enabled: true,
                    position: "left",
                    fontSize: 10,
                  },
                },
              ],
              drawTime: "beforeDatasetsDraw", // (default)
            },
          },
        };

        return {
          keys: {
            lineChartPiezasCorCosRevProps: lineChartPiezasCorCosRev,
            mediaPiezasCortadas: util.formatter(mediaPiezasCortadas, 2) || 0,
            mediaPiezasCosidas: util.formatter(mediaPiezasCosidas, 2) || 0,
            mediaPiezasRevestidas: util.formatter(mediaPiezasRevestidas, 2) || 0,
            totalCortadas: util.formatter(totalPiezasCorCosRev.totalCortadas, 0),
            totalCosidas: util.formatter(totalPiezasCorCosRev.totalCosidas, 0),
            totalRevestidas: util.formatter(totalPiezasCorCosRev.totalRevestidas, 0),
          },
        };
      },
    },
  ],
  onBufferFiltroIntervaloFechaChanged: [
    {
      condition: payload => payload.value !== undefined,
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => {
        const interval = util.intervalos[payload.value];
        const intervalFechaDesde = interval.desde();
        const intervalFechaHasta = interval.hasta();
        return {
          keys: {
            bufferFiltro: {
              ...bufferFiltro,
              intervaloFecha: payload.value,
              fechaDesde: intervalFechaDesde,
              fechaHasta: intervalFechaHasta,
            },
          },
        };
      },
    },
    {
      condition: payload => payload.value !== undefined,
      type: "grape",
      name: "dibujaGraficos",
    },
  ],
  onBufferFiltroFechaDesdeChanged: [
    {
      condition: payload => payload.value !== undefined,
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => {
        return { keys: { bufferFiltro: { ...bufferFiltro, fechaDesde: payload.value } } };
      },
    },
    {
      condition: payload => payload.value !== undefined,
      type: "grape",
      name: "dibujaGraficos",
    },
  ],
  onBufferFiltroFechaHastaChanged: [
    {
      condition: payload => payload.value !== undefined,
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => {
        return { keys: { bufferFiltro: { ...bufferFiltro, fechaHasta: payload.value } } };
      },
    },
    {
      condition: payload => payload.value !== undefined,
      type: "grape",
      name: "dibujaGraficos",
    },
  ],
  dibujaGraficos: [
    {
      type: "grape",
      name: "dibujaGraficoMetrosDia",
    },
    {
      type: "grape",
      name: "dibujaGraficoPiezas",
    },
    {
      type: "grape",
      name: "calculaRetrasoFabricadas",
    },
    {
      type: "grape",
      name: "calculaRetrasoSalidaProducto",
    },
    {
      type: "grape",
      name: "dibujaGraficoPiezasCorCosRev",
    },
  ],
});
