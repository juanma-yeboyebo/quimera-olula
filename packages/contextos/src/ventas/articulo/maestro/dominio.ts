import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import {
    accionesListaActivaEntidades,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.js";
import { Articulo } from "../diseño.ts";
import { totalEstimado } from "../dominio.ts";
import { getArticulos } from "../infraestructura.ts";
import { ContextoMaestroArticulo, EstadoMaestroArticulo } from "./diseño.ts";

export type ProcesarMaestroArticulo = ProcesarContexto<
    EstadoMaestroArticulo,
    ContextoMaestroArticulo
>;

const conArticulos =
    (fn: ProcesarListaActivaEntidades<Articulo>) =>
        (ctx: ContextoMaestroArticulo) => ({ ...ctx, articulos: fn(ctx.articulos) });

export const Articulos = accionesListaActivaEntidades(conArticulos);

const consultarArticulos = async (criteria: Criteria) => {
    const datos = await getArticulos(criteria.filtro, criteria.orden, criteria.paginacion);

    return { datos, total: totalEstimado(criteria.paginacion, datos.length) };
};

export const recargarArticulos: ProcesarMaestroArticulo = async (contexto, payload) => {
    const criteria = payload as Criteria;
    return Articulos.recargar(contexto, await consultarArticulos(criteria));
};

export const ampliarArticulos: ProcesarMaestroArticulo = async (contexto, payload) => {
    const criteria = payload as Criteria;
    return Articulos.ampliar(contexto, await consultarArticulos(criteria));
};
