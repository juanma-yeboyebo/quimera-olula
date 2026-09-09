import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ItemPedidoCompra } from "../diseño.ts";
import { getPedidos } from "../infraestructura.ts";
import { ContextoMaestroPedidoCompra, EstadoMaestroPedidoCompra } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroPedidoCompra, ContextoMaestroPedidoCompra>;

const conPedidos = (fn: ProcesarListaActivaEntidades<ItemPedidoCompra>) =>
    (ctx: ContextoMaestroPedidoCompra) => ({ ...ctx, pedidos: fn(ctx.pedidos) });

export const Pedidos = accionesListaActivaEntidades(conPedidos);

/**
 * Recargar lista desde API (reemplaza la lista entera)
 */
export const recargarPedidos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPedidos(criteria.filtro, criteria.orden, criteria.paginacion);
    return Pedidos.recargar(contexto, resultado);
};

/**
 * Ampliar lista (paginación incremental: añade elementos a los existentes)
 */
export const ampliarPedidos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPedidos(criteria.filtro, criteria.orden, criteria.paginacion);
    return Pedidos.ampliar(contexto, resultado);
};
