import { Entidad, Filtro, Orden, Paginacion, RespuestaLista } from "@olula/lib/diseño.ts";

export interface ItemPedidoVenta extends Entidad {
    id: string;
    fecha: Date;
    cliente: string;
    codigo: string;
}

export type GetPedidosVenta = (filtro: Filtro, orden: Orden, paginacion?: Paginacion) => RespuestaLista<ItemPedidoVenta>;

export type GenerarSalidaDesdePedidos = (pedidoIds: number[], ubicacionDestinoId: number) => Promise<void>;
