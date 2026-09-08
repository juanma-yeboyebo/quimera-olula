import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { GetInfoLineasPedidoCompra, GetPedido, GetPedidos, ItemPedidoCompra, LineaNuevaEntradaDesdePedido, LineaPedidoCompra, LoteLineaNuevaEntradaDesdePedido, NuevaEntradaDesdePedido, PedidoCompra, PostEntradaDesdePedido } from "./diseño.ts";


interface ItemPedidoCompraApi {
    id: string;
    fecha: string;
    codigo: string;
    remitente: string;
}

interface LineaPedidoCompraApi {
    id: string;
    sku: string;
    descripcion: string;
    cantidad: number;
    cantidad_recibida: number;
    cerrada: boolean;
}

interface PedidoCompraApi extends ItemPedidoCompraApi {
    lineas: LineaPedidoCompraApi[];
}

const baseUrl = `/almacen/pedido_compra`;

const itemPedidoCompraDesdeApi = (api: ItemPedidoCompraApi): ItemPedidoCompra => ({
    id: api.id,
    fecha: new Date(Date.parse(api.fecha)),
    codigo: api.codigo,
    proveedor: api.remitente,
});

const lineaPedidoCompraDesdeApi = (api: LineaPedidoCompraApi): LineaPedidoCompra => ({
    id: api.id,
    sku: api.sku,
    descripcion: api.descripcion,
    cantidad: api.cantidad,
    cantidadRecibida: api.cantidad_recibida,
    cerrada: api.cerrada,
});

const pedidoCompraDesdeApi = (api: PedidoCompraApi): PedidoCompra => ({
    ...itemPedidoCompraDesdeApi(api),
    lineas: api.lineas.map(lineaPedidoCompraDesdeApi),
});

export const getPedidos: GetPedidos = (filtro, orden, paginacion) => {
    const q = criteriaQuery(filtro, orden, paginacion);
    return RestAPI.get<{ datos: ItemPedidoCompraApi[]; total: number }>(baseUrl + q).then((respuesta) => ({
        datos: respuesta.datos.map(itemPedidoCompraDesdeApi),
        total: respuesta.total,
    }));
};

export const getPedido: GetPedido = async (id) => {
    const respuesta = await RestAPI.get<{ datos: PedidoCompraApi }>(`${baseUrl}/${id}`);
    return pedidoCompraDesdeApi(respuesta.datos);
};

export const postEntradaDesdePedido: PostEntradaDesdePedido = async (nueva: NuevaEntradaDesdePedido) => {

    const loteAApi = (lote: LoteLineaNuevaEntradaDesdePedido) => ({
        id: lote.id,
        cantidad: lote.cantidad,
        ...(
            "caducidad" in lote ? { caducidad: lote.caducidad?.toISOString().slice(0, 10) } : {}
        ),
    });

    const lineaAApi = (linea: LineaNuevaEntradaDesdePedido) => ({
        id: linea.id,
        cantidad: linea.cantidad,
        ...(
            "lotes" in linea ? { lotes: linea.lotes!.map((l) => loteAApi(l)) } : {}
        )
    });


    const respuesta = await RestAPI.post(
        `/almacen/orden/desde_pedido_compra`,
        {
            ubicacion_id: nueva.ubicacionId,
            pedido_id: nueva.pedidoCompraId,
            ...(
                "lineas" in nueva ? { lineas: nueva.lineas!.map((l) => lineaAApi(l)) } : {}
            )

        },
        "Error al crear entrada desde pedido de compra"
    );
    return respuesta.id as string;
};

interface LineaNuevaEntradaDesdePedidoApi {
    id: string;
    cantidad: number;
    lotes?: {
        id: string;
        cantidad: number;
        caducidad?: string;
    }[];
}

const lineaNuevaEntradaDesdeApi = (api: LineaNuevaEntradaDesdePedidoApi): LineaNuevaEntradaDesdePedido => ({
    id: api.id,
    cantidad: api.cantidad,
    ...(api.lotes ? {
        lotes: api.lotes.map((l) => ({
            id: l.id,
            cantidad: l.cantidad,
            ...(l.caducidad ? { caducidad: new Date(Date.parse(l.caducidad)) } : {}),
        })),
    } : {}),
});

export const getInfoLineasPedidoCompra: GetInfoLineasPedidoCompra = async (pedidoCompraId, foto) => {
    const formData = new FormData();
    formData.append("foto", foto);

    const respuesta = await RestAPI.query<FormData, { lineas: LineaNuevaEntradaDesdePedidoApi[] }>(
        `${baseUrl}/${pedidoCompraId}/analizar_recepcion`,
        formData,
        "Error al leer albarán"
    );
    return respuesta.lineas.map(lineaNuevaEntradaDesdeApi);
};
