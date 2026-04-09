import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { cambioClienteVentaVacio, clienteVentaVacio, ventaVacia } from "../venta/dominio.ts";
import { CambioClientePresupuesto, NuevoPresupuesto, Presupuesto } from "./diseño.ts";

export const metaTablaPresupuesto: MetaTabla<Presupuesto> = [
    {
        id: "codigo",
        cabecera: "Código",
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
        render: (p) => p.cliente.nombre_cliente,
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },
];

export const presupuestoVacio = (): Presupuesto => ({
    ...ventaVacia,
    cliente: clienteVentaVacio,
    aprobado: false,
    fecha_salida: new Date(),
    lineas: [],
});

export const nuevoPresupuestoVacio: NuevoPresupuesto = {
    cliente_id: "",
    direccion_id: "",
    empresa_id: "1",
};

export const cambioClientePresupuestoVacio: CambioClientePresupuesto = cambioClienteVentaVacio;

