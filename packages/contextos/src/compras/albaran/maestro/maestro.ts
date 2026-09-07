import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { Albaran } from "../diseño.ts";
import { getAlbaran, getAlbaranes } from "../infraestructura.ts";
import { ContextoMaestroAlbaran, EstadoMaestroAlbaran } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroAlbaran, ContextoMaestroAlbaran>;

const conAlbaranes = (fn: ProcesarListaActivaEntidades<Albaran>) =>
    (ctx: ContextoMaestroAlbaran) => ({ ...ctx, albaranes: fn(ctx.albaranes) });

export const Albaranes = accionesListaActivaEntidades(conAlbaranes);

export const recargarAlbaranes: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getAlbaranes(criteria);
    return Albaranes.recargar(contexto, resultado);
};

export const ampliarAlbaranes: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getAlbaranes(criteria);
    return Albaranes.ampliar(contexto, resultado);
};

export const incluirAlbaranCreadoPorId: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const albaran = await getAlbaran(id);
    return {
        ...contexto,
        estado: "INICIAL",
        albaranes: {
            ...contexto.albaranes,
            lista: [albaran, ...contexto.albaranes.lista],
            total: contexto.albaranes.total + 1,
            activo: albaran.id,
        },
    };
};
