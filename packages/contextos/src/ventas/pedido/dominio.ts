import { MetaTabla } from "@olula/componentes/index.js";
import { cambioClienteVentaVacio, clienteVentaVacio, nuevaVentaVacia, ventaVacia } from "../venta/dominio.ts";
import { CambioClientePedido, NuevoPedido, Pedido } from "./diseño.ts";

export const metaTablaPedido: MetaTabla<Pedido> = [
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

export const pedidoVacio = (): Pedido => ({
    ...ventaVacia,
    cliente: clienteVentaVacio,
    servido: 'No',
    lineas: [],
});

export const nuevoPedidoVacio: NuevoPedido = nuevaVentaVacia;

export const cambioClientePedidoVacio: CambioClientePedido = cambioClienteVentaVacio;

export const cambioCliente = (pedido: Pedido): CambioClientePedido => ({
    cliente_id: pedido.cliente.cliente_id ?? "",
    direccion_id: pedido.cliente.direccion_id ?? "",
});


