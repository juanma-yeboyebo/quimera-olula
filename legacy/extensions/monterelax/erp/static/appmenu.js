export default parent => ({
  ...parent,
  gerencia: {
    title: "Gerencia",
    items: {
      dashboardGerencia: {
        title: "Dashboard Gerencia",
        rule: "Menu:botones-gerencia",
        icons: ["dashboard", "bar_chart"],
        color: "warning",
        variant: "main",
        url: "/dashboardGerencia/gerencia",
      },
      // dashboardTesoreria: {
      //   title: "Tesorería",
      //   rule: "Menu:botones-gerencia",
      //   icons: ["euro", "bar_chart"],
      //   color: "warning",
      //   variant: "main",
      //   url: "/dashboardTesoreria",
      // },
    },
  },
  produccion: {
    title: "Producción",
    items: {
      dashboardProduccion: {
        title: "Producción",
        rule: "Menu:botones-produccion",
        icons: ["build", "bar_chart"],
        color: "warning",
        variant: "main",
        url: "/dashboardGerencia/produccion",
      },
    },
  },
  representantes: {
    title: "Representantes",
    items: {
      ventas: {
        title: "Ventas",
        rule: "Menu:botones-agente",
        icons: ["shopping_cart"],
        url: "/dashboardRepresentantes",
      },
      cobros: {
        title: "Cobros",
        rule: "Menu:botones-agente",
        icons: ["payment"],
        url: "/dashboardCobros",
      },
      pedidos: {
        title: "Seguimiento de Pedidos",
        rule: "Menu:botones-agente",
        icons: ["assignment_turned_in"],
        url: "/pedidosCliente",
      },
      tarifas: {
        title: "Tarifas",
        rule: "Menu:botones-agente",
        icons: ["local_offer"],
        url: "/documentos",
      },
      stocks: {
        title: "Productos disponibles",
        rule: "Menu:botones-productosdisponibles",
        icons: ["weekend"],
        url: "/dashboardStocks",
      },
    },
  },
  fabrica: {
    title: "Fábrica",
    items: {
      ordenes: {
        title: "Órdenes de Carga",
        rule: "Menu:botones-trabajador",
        icons: ["local_shipping"],
        url: "/ordenesDeCarga",
      },
    },
  },
  // esqueletos: {
  //   title: "Esqueletos",
  //   items: {
  //     solicitud: {
  //       title: "Solicitud de Esqueletos",
  //       rule: "Menu:botones-esqueletero",
  //       icons: ["single_bed", "add"],
  //       color: "info",
  //       variant: "main",
  //       url: "/dashboardEsqueletos",
  //     },
  //   },
  // },
  cosido: {
    title: "Cosido",
    items: {
      cola: {
        title: "Cola de Cosido",
        rule: "Menu:botones-cosido",
        icons: ["gesture", "rotate_left"],
        color: "secondary",
        variant: "dark",
        url: "/colacosido",
      },
      recepcion: {
        title: "Recepción de Cosido",
        rule: "Menu:botones-recepcioncosido",
        icons: ["gesture", "done"],
        color: "success",
        variant: "main",
        url: "/recepcioncosido",
      },
      dashboardCosido: {
        title: "Dashboard Cosido",
        rule: "Menu:botones-dashboardcosido",
        icons: ["gesture", "bar_chart"],
        color: "warning",
        variant: "main",
        url: "/dashboardCosido",
      },
      colainternacosido: {
        title: "Cola de Cosido interna",
        rule: "Menu:botones-cosido-interno",
        icons: ["gesture", "rotate_left"],
        color: "primary",
        variant: "dark",
        url: "/colaCosidoInterno",
      },
    },
  },
  montado: {
    title: "Montado",
    items: {
      cola: {
        title: "Cola de Montado",
        rule: "Menu:botones-montado",
        icons: ["assignment", "single_bed"],
        color: "secondary",
        variant: "dark",
        url: "/colaMontado",
      },
      colainterna: {
        title: "Cola de Montado interna",
        rule: "Menu:botones-montado-interno",
        icons: ["assignment", "single_bed"],
        color: "primary",
        variant: "dark",
        url: "/colaMontadoInterno",
      },
    },
  },
});
