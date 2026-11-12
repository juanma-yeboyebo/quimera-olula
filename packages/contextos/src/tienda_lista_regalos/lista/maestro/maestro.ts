import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { FiltrosListaRegalos, ItemListaRegalos } from "../diseño.ts";
import { itemDeLista } from "../dominio.ts";
import { getListaRegalos, getListasRegalos } from "../infraestructura.ts";
import { ContextoMaestroListaRegalos, EstadoMaestroListaRegalos } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroListaRegalos, ContextoMaestroListaRegalos>;

const conListas = (fn: ProcesarListaActivaEntidades<ItemListaRegalos>) =>
    (ctx: ContextoMaestroListaRegalos) => ({ ...ctx, listas: fn(ctx.listas) });

export const Listas = accionesListaActivaEntidades(conListas);

export const cambiarWebsite: ProcesarMaestro = async (contexto, payload) => ({
    ...contexto,
    filtros: { ...contexto.filtros, websiteId: payload as number },
    listas: { ...contexto.listas, activo: undefined },
});

export const cambiarFiltros: ProcesarMaestro = async (contexto, payload) => {
    const criteria = contexto.listas.criteria;
    return {
        ...contexto,
        filtros: { ...contexto.filtros, ...(payload as Partial<FiltrosListaRegalos>) },
        listas: {
            ...contexto.listas,
            criteria: { ...criteria, paginacion: { ...criteria.paginacion, pagina: 1 } },
        },
    };
};

export const recargarListas: ProcesarMaestro = async (contexto) => {
    if (contexto.filtros.websiteId === null) return contexto;
    const resultado = await getListasRegalos(contexto.filtros, contexto.listas.criteria);
    return Listas.recargar(contexto, resultado);
};

export const ampliarListas: ProcesarMaestro = async (contexto) => {
    if (contexto.filtros.websiteId === null) return contexto;
    const resultado = await getListasRegalos(contexto.filtros, contexto.listas.criteria);
    return Listas.ampliar(contexto, resultado);
};

export const incluirListaCreadaPorId: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const item = itemDeLista(await getListaRegalos(id));
    return {
        ...contexto,
        estado: "INICIAL",
        listas: {
            ...contexto.listas,
            lista: [item, ...contexto.listas.lista],
            total: contexto.listas.total + 1,
            activo: item.id,
        },
    };
};
