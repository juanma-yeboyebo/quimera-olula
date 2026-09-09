import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import {
    accionesListaActivaEntidades,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.ts";
import { Articulo } from "../diseño.ts";
import { getArticulos } from "../infraestructura.ts";
import { ContextoMaestroArticulo, EstadoMaestroArticulo } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroArticulo, ContextoMaestroArticulo>;

const conArticulos = (fn: ProcesarListaActivaEntidades<Articulo>) =>
    (ctx: ContextoMaestroArticulo) => ({ ...ctx, articulos: fn(ctx.articulos) });

export const Articulos = accionesListaActivaEntidades(conArticulos);

export const recargarArticulos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getArticulos(criteria);
    return Articulos.recargar(contexto, resultado);
};

export const ampliarArticulos: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getArticulos(criteria);
    return Articulos.ampliar(contexto, resultado);
};
