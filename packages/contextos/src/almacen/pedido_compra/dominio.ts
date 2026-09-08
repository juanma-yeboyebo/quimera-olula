import { ItemPedidoCompra, LineaPedidoCompra, PedidoCompra } from "./diseño.ts";

export const lineaPedidoCompraVacia: LineaPedidoCompra = {
    id: "",
    sku: "",
    descripcion: "",
    cantidad: 0,
    cantidadRecibida: 0,
    cerrada: false,
};

export const itemPedidoCompraVacio: ItemPedidoCompra = {
    id: "",
    fecha: new Date(0),
    proveedor: "",
    codigo: "",
};

export const pedidoCompraVacio: PedidoCompra = {
    ...itemPedidoCompraVacio,
    lineas: [],
};
