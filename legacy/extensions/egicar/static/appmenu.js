export default parent => ({
  ...parent,
  tareas: {
    title: "Tareas",
    items: {
      gestionTareas: {
        title: "Tareas de terminal",
        icons: ["assignment", "restart_alt"],
        color: "primary",
        variant: "main",
        url: "/tareas/tareasterminal",
      },
    },
  },
  ordenesProd: {
    title: "Ordenes de producción",
    items: {
      gestionOP: {
        title: "Ordenes de producción",
        icons: ["list_alt", "restart_alt"],
        color: "primary",
        variant: "main",
        url: "/ordenesprod",
      },
    },
  },
  albaranes: {
    title: "Albaranes",
    items: {
      albaranes: {
        title: "Firmar",
        icons: ["article", "create"],
        color: "primary",
        variant: "main",
        url: "/albaranesVenta",
      },
    },
  },
});
