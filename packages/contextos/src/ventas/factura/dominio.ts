import { MetaTabla } from "@olula/componentes/index.js";
import {
    cambioClienteVentaVacio,
    clienteVentaVacio,
    nuevaVentaVacia,
    ventaVacia
} from "../venta/dominio.ts";
import {
    CambioClienteFactura,
    Factura,
    NuevaFactura
} from "./diseño.ts";

export const metaTablaFactura: MetaTabla<Factura> = [
    {
        id: "codigo",
        cabecera: "Código",
    },
    {
        id: "nombre_cliente",
        cabecera: "Cliente",
        render: (f) => f.cliente.nombre_cliente,
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },
];

export const facturaVacia = (): Factura => ({
    ...ventaVacia,
    cliente: clienteVentaVacio,
    editable: false,
});

export const nuevaFacturaVacia: NuevaFactura = nuevaVentaVacia;

export const cambioClienteFacturaVacio: CambioClienteFactura = cambioClienteVentaVacio;

