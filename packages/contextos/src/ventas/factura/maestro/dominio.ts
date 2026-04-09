import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { Factura } from "../diseño.ts";
import { getFacturas } from "../infraestructura.ts";
import { ContextoMaestroFactura, EstadoMaestroFactura } from "./diseño.ts";

type ProcesarFacturas = ProcesarContexto<EstadoMaestroFactura, ContextoMaestroFactura>;

const conFacturas = (fn: ProcesarListaActivaEntidades<Factura>) => (ctx: ContextoMaestroFactura) => ({ ...ctx, facturas: fn(ctx.facturas) });

export const Facturas = accionesListaActivaEntidades(conFacturas);

export const recargarFacturas: ProcesarFacturas = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getFacturas(criteria.filtro, criteria.orden, criteria.paginacion);

    return Facturas.recargar(contexto, resultado);
}

export const ampliarFacturas: ProcesarFacturas = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getFacturas(criteria.filtro, criteria.orden, criteria.paginacion);

    return Facturas.ampliar(contexto, resultado);
}
