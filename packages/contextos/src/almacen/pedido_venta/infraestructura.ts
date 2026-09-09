import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { GenerarSalidaDesdePedidos, GetPedidosVenta, ItemPedidoVenta } from "./diseño.ts";


interface ItemPedidoVentaApi {
    id: string;
    fecha: string;
    codigo: string;
    cliente: string;
}

interface OrdenDesdePedidosVentaApi {
    pedido_ids: number[];
    ubicacion_destino_id: number;
}

const baseUrl = `/almacen/pedido_venta`;

export const itemPedidoVentaDesdeApi = (api: ItemPedidoVentaApi): ItemPedidoVenta => ({
    id: api.id,
    fecha: new Date(Date.parse(api.fecha)),
    codigo: api.codigo,
    cliente: api.cliente,
});

export const getPedidosVenta: GetPedidosVenta = (filtro, orden, paginacion) => {
    const q = criteriaQuery(filtro, orden, paginacion);
    return RestAPI.get<{ datos: ItemPedidoVentaApi[]; total: number }>(baseUrl + q).then((respuesta) => ({
        datos: respuesta.datos.map(itemPedidoVentaDesdeApi),
        total: respuesta.total,
    }));
};

export const generarSalidaDesdePedidos: GenerarSalidaDesdePedidos = async (pedidoIds, ubicacionDestinoId) => {
    const payload: OrdenDesdePedidosVentaApi = {
        pedido_ids: pedidoIds,
        ubicacion_destino_id: ubicacionDestinoId,
    };
    await RestAPI.post(
        `/almacen/orden/desde_pedidos_venta`,
        payload,
        "Error al generar salida desde pedidos de venta"
    );
};
