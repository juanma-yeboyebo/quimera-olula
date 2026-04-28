export const menuVentas = {
    "Pedidos": { icono: "fichero" },
    "Pedidos/Presupuestos": { url: "/ventas/presupuestos", regla: "presupuestoscli" },
    "Pedidos/Pedidos": { url: "/ventas/pedidos", regla: "pedidoscli" },
    "Pedidos/Devoluciones": { url: "/DevolucionesPedidos", regla: "pedidoscli" },
    "Pedidos/Previsión de compras": { url: "/prevision-compras", regla: "OnlyAdmin:visit" },
};
