import { getSchemas, util } from "quimera";

import chartdata from "./chartdata";

export const state = parent => ({
  ...parent,
  dataMap: chartdata.dataMap,
  layoutMap: chartdata.layoutMap,
  filter: {
    codCliente: null,
    ref1: null,
    ref2: null,
    ref3: null,
    minFacturacion: 200,
    intervalo: null,
    fechaDesde: null,
    fechaHasta: null,
    zoom: 15,
    coordinates: null,
    centerlat: null,
    centerlon: null,
  },
  clients: [],
});

export const bunch = parent => ({
  ...parent,
  onInit: [
    {
      type: "setStateKey",
      plug: ({ width }) => ({
        path: "layoutMap.width",
        value: ["xs", "sm"].includes(width) ? 425 : 800,
      }),
    },
    {
      type: "grape",
      name: "onFilterIntervaloChanged",
      plug: () => ({ value: "prevyear" }),
    },
  ],
  onAtrasClicked: [
    {
      type: "function",
      function: () => window.history.back(),
    },
  ],
  onFilterIntervaloChanged: [
    {
      type: "setStateKey",
      plug: ({ value }) => ({ path: "filter.intervalo", value }),
    },
    {
      condition: ({ value }) => !!value,
      type: "setStateKey",
      plug: ({ value }, { filter }) => ({
        path: "filter",
        value: {
          ...filter,
          fechaDesde: util.intervalos[value]?.desde(),
          fechaHasta: util.intervalos[value]?.hasta(),
        },
      }),
    },
  ],
  onClearFilterClicked: [
    {
      type: "setStateKey",
      plug: () => ({
        path: "filter",
        value: {
          codCliente: null,
          ref1: null,
          ref2: null,
          ref3: null,
          minFacturacion: 200,
          intervalo: null,
          fechaDesde: null,
          fechaHasta: null,
          zoom: 15,
          coordinates: null,
          centerlat: null,
          centerlon: null,
        },
      }),
    },
    {
      type: "grape",
      name: "onFilterIntervaloChanged",
      plug: () => ({ value: "prevyear" }),
    },
  ],
  onRefreshMapClicked: [
    {
      type: "setStateKey",
      plug: (_, { filter }) => ({
        path: "filter",
        value: {
          ...filter,
          zoom: 15,
          coordinates: null,
          centerlat: null,
          centerlon: null,
        },
      }),
    },
    {
      type: "grape",
      name: "onUpdateMapData",
    },
  ],
  onUpdateMapData: [
    {
      type: "get",
      schema: getSchemas().graficoGeolocalizacion,
      id: () => "-static-",
      params: (_, { filter, layoutMap }) => ({
        ...filter,
        width: layoutMap.width,
        height: layoutMap.height,
      }),
      action: "get_direcciones_mapa",
      success: "onMapDataRecieved",
    },
  ],
  onMapDataRecieved: [
    {
      type: "setStateKeys",
      plug: ({ response }, { dataMap, layoutMap, filter }) => ({
        keys: {
          dataMap: [
            {
              ...dataMap[0],
              lat: response.locations.lat,
              lon: response.locations.lon,
              text: response.locations.text,
              name: response.locations.text,
              marker: {
                ...dataMap[0].marker,
                color: response.locations.color,
                size: response.locations.size,
              },
            },
          ],
          layoutMap: {
            ...layoutMap,
            mapbox: {
              ...layoutMap.mapbox,
              center: response.center,
              zoom: response.zoom ?? layoutMap.mapbox.zoom,
            },
          },
          filter: {
            ...filter,
            zoom: 15,
            coordinates: null,
            centerlat: null,
            centerlon: null,
          },
          clients: response.clients,
        },
      }),
    },
  ],
  onMapRelayout: [
    {
      type: "setStateKey",
      plug: (payload, { filter }) => ({
        path: "filter",
        value: {
          ...filter,
          zoom: payload.zoom,
          coordinates: payload.coordinates,
          centerlat: payload.c_lat,
          centerlon: payload.c_lon,
        },
      }),
    },
    {
      type: "grape",
      name: "onUpdateMapData",
    },
  ],
  onShowRecomClicked: [],
});
