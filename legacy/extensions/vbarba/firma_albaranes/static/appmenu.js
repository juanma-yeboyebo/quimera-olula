export default parent => ({
  ...parent,
  albaranes: {
    title: "Albaranes",
    items: {
      albaranes: {
        title: "Firmar Albaranes",
        icons: ["article", "create"],
        color: "primary",
        variant: "contained",
        rule: "albaranescli:firmaalbaranes",
        url: "/albaranesVenta",
      },
      puestoFirma: {
        title: "Cambiar Puesto de firma",
        icons: ["fact_check"],
        color: "primary",
        variant: "contained",
        rule: "albaranescli:firmapuesto",
        url: "/puestoFirma",
      },
      albaranesPuesto: {
        title: "Firma Puesto",
        icons: ["article", "create"],
        color: "primary",
        variant: "contained",
        rule: "albaranescli:firmapuesto",
        url: "/albaranesPuesto",
      },
    },
  },
});
