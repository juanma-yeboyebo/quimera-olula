import { menuVentas as menuOlula } from "#/ventas/menu.ts";

export const menuVentas = {
    ...menuOlula,
    "Ventas/Pedidos Legacy": { url: "/ventas/pedidos", regla: "ventas.pedido.leer" },
    "Ventas/Presupuestos Legacy": { url: "/ventas/presupuestos", regla: "ventas.presupuesto.leer" },
};