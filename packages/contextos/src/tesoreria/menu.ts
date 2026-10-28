export const menuTesoreria = {
    "Tesorería": { icono: "menu_tesoreria", area: "Finanzas" },
    "Tesorería/Resumen": { url: "/dashboard/tesoreria" },
    "Tesorería/Remesas de cobro": { alias: ["SEPA", "domiciliaciones"], url: "/tesoreria/remesa", regla: "tesoreria.remesa" },
    "Tesorería/Mandatos": { url: "/tesoreria/mandato", regla: "tesoreria.mandato" },
    "Tesorería/Recibos de cobro": { url: "/tesoreria/recibo_venta", regla: "tesoreria.recibo_venta" },
    "Tesorería/Recibos de pago": { url: "/tesoreria/recibo_compra", regla: "tesoreria.recibo_compra" },
    "Tesorería/Conexiones bancarias": { url: "/tesoreria/conexion_bancaria", regla: "tesoreria.conexion_bancaria" },
    "Tesorería/Conciliación bancaria": { alias: ["banco", "extracto", "movimientos"], url: "/tesoreria/conciliacion", regla: "tesoreria.conciliacion" },
};
