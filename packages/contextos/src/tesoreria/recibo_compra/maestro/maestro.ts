import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ReciboCompra } from "../diseño.js";
import { getRecibosCompra } from "../infraestructura.js";
import { ContextoMaestroReciboCompra, EstadoMaestroReciboCompra } from "./diseño.js";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroReciboCompra, ContextoMaestroReciboCompra>;

const conRecibos = (fn: ProcesarListaActivaEntidades<ReciboCompra>) =>
    (ctx: ContextoMaestroReciboCompra) => ({ ...ctx, recibos: fn(ctx.recibos) });

export const Recibos = accionesListaActivaEntidades(conRecibos);

export const recargarRecibos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getRecibosCompra(criteria);
    return Recibos.recargar(contexto, resultado);
};

export const ampliarRecibos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getRecibosCompra(criteria);
    return Recibos.ampliar(contexto, resultado);
};
