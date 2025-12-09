export default {
  dataMap: [
    {
      type: "scattermapbox",
      lat: ["41.482558"],
      lon: ["-0.151526"],
      mode: "markers",
      hovertemplate: "%{text}<extra></extra>",
      hoverlabel: {
        bgcolor: "white",
      },
      marker: {
        color: "blue",
        size: 14,
      },
      text: ["Pol. ind. Lastra Monegros"],
      name: ["Pol. ind. Lastra Monegros"],
      showlegend: false,
    },
  ],
  layoutMap: {
    autosize: true,
    height: 750,
    width: 425,
    hovermode: "closest",
    dragmode: "zoom",
    mapbox: {
      bearing: 0,
      center: {
        lat: 41.482558,
        lon: -0.151526,
      },
      domain: {
        x: [0, 1],
        y: [0, 1],
      },
      pitch: 0,
      zoom: 14,
      style: "open-street-map",
    },
    margin: {
      r: 0,
      t: 0,
      b: 0,
      l: 0,
      pad: 0,
    },
  },
};
