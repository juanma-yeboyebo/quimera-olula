import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ItemPedidoVenta } from "../../diseño.ts";
import { getPedidosVenta } from "../../infraestructura.ts";
import { ContextoMaestroPedidoVenta, EstadoMaestroPedidoVenta } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroPedidoVenta, ContextoMaestroPedidoVenta>;

const conPedidos =
    (fn: ProcesarListaActivaEntidades<ItemPedidoVenta>) => (ctx: ContextoMaestroPedidoVenta) => ({
        ...ctx,
        pedidos: fn(ctx.pedidos),
    });

export const Pedidos = accionesListaActivaEntidades(conPedidos);

export const recargarPedidos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPedidosVenta(
        criteria.filtro,
        criteria.orden,
        criteria.paginacion
    );
    return Pedidos.recargar(contexto, resultado);
};

export const ampliarPedidos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getPedidosVenta(
        criteria.filtro,
        criteria.orden,
        criteria.paginacion
    );
    return Pedidos.ampliar(contexto, resultado);
};
