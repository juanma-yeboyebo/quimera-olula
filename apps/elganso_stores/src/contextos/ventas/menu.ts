export const menuVentas = {
    // ********** Sección PLanificador **********
    "Planificador Semanal": { icono: "calendario_vacio", posicion: 2 },
    "Planificador Semanal/Planificador Semanal": {
        url: "/planificador_semanal",
        regla: "PlanificadorSemanal:visit",
        icono: "calendario_mes",
    },
    "Planificador Semanal/Resumen Planificador": {
        url: "/planificador_semanal_resumen",
        regla: "PlanificadorSemanalResumen:visit",
        icono: "lista_detalle",
    },
    "Planificador Semanal/Resumen Agente": {
        url: "/resumen_agente",
        icono: "usuario_search",
    },
    "Planificador Semanal/Control Horario": {
        url: "/control_horario",
        icono: "clock_3",
    },
    // ********** Sección Pedidos **********
    "Pedidos": { icono: "tienda", posicion: 3 },
    "Pedidos/Listado de Pedidos": {
        url: "/tpv/venta",
        regla: "tpv.venta.leer",
        icono: "fichero",
    },
    "Pedidos/Preparación Pedidos Web": {
        url: "/pedidos_web",
        icono: "bolsa",
    },
};
