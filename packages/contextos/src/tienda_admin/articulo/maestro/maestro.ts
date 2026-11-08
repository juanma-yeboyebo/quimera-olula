import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { getArbolCategorias } from "../../categoria/infraestructura.ts";
import { ArticuloWeb, FiltrosArticulo } from "../diseño.ts";
import { opcionesFiltroCategoria } from "../dominio.ts";
import { getArticulos } from "../infraestructura.ts";
import { ContextoMaestroArticulo, EstadoMaestroArticulo } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroArticulo, ContextoMaestroArticulo>;

const conArticulos = (fn: ProcesarListaActivaEntidades<ArticuloWeb>) =>
    (ctx: ContextoMaestroArticulo) => ({ ...ctx, articulos: fn(ctx.articulos) });

export const Articulos = accionesListaActivaEntidades(conArticulos);

export const cambiarWebsite: ProcesarMaestro = async (contexto, payload) => {
    const websiteId = payload as number;
    const arbol = await getArbolCategorias(websiteId);
    return {
        ...contexto,
        filtros: { ...contexto.filtros, websiteId, categoriaId: null },
        opcionesCategoria: opcionesFiltroCategoria(arbol),
        articulos: { ...contexto.articulos, activo: undefined },
    };
};

export const cambiarFiltros: ProcesarMaestro = async (contexto, payload) => {
    const criteria = contexto.articulos.criteria;
    return {
        ...contexto,
        filtros: { ...contexto.filtros, ...(payload as Partial<FiltrosArticulo>) },
        articulos: {
            ...contexto.articulos,
            criteria: { ...criteria, paginacion: { ...criteria.paginacion, pagina: 1 } },
        },
    };
};

export const recargarArticulos: ProcesarMaestro = async (contexto) => {
    if (contexto.filtros.websiteId === null) return contexto;
    const resultado = await getArticulos(contexto.filtros, contexto.articulos.criteria);
    return Articulos.recargar(contexto, resultado);
};

export const ampliarArticulos: ProcesarMaestro = async (contexto) => {
    if (contexto.filtros.websiteId === null) return contexto;
    const resultado = await getArticulos(contexto.filtros, contexto.articulos.criteria);
    return Articulos.ampliar(contexto, resultado);
};
