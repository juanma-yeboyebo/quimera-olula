import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { VentaTpv } from "../diseño.ts";
import { getVentas } from "../infraestructura.ts";
import { ContextoMaestroVentaTpv, EstadoMaestroVentaTpv } from "./diseño.ts";

type ProcesarVentasTpv = ProcesarContexto<EstadoMaestroVentaTpv, ContextoMaestroVentaTpv>;

const conVentas = (fn: ProcesarListaActivaEntidades<VentaTpv>) => (ctx: ContextoMaestroVentaTpv) => ({ ...ctx, ventas: fn(ctx.ventas) });

export const Ventas = accionesListaActivaEntidades(conVentas);

export const recargarVentas: ProcesarVentasTpv = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getVentas(criteria.filtro, criteria.orden, criteria.paginacion);

    return Ventas.recargar(contexto, resultado);
}

export const ampliarVentas: ProcesarVentasTpv = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getVentas(criteria.filtro, criteria.orden, criteria.paginacion);

    return Ventas.ampliar(contexto, resultado);
}
